import { getHash } from "../helpers/crypto.helper.js";
import { getUtcDate } from "../helpers/date.helper.js";
import db, { sequelize } from "../models/index.js";
import { queryLessonsWithProgress, queryLessonWithCorrectAnswers, queryLessonWithProblems } from "../services/lesson.services.js"
import { checkAttemptedSubmission, insertSubmission, prepareSubmissionResult, queryExistingCorrectAnswerOfLesson } from "../services/submission.service.js";
import { bulkInsertSubmissionAnswer } from "../services/submission_answer.service.js";
import { queryUserById } from "../services/user.services.js";
import { findOrCreateUserProgress, updateUserProgressAfterSubmit } from "../services/user_progress.service.js";
import { findOrCreateUserStat, updateUserStatAfterSubmit } from "../services/user_stat.service.js";
import { insertXpLedger } from "../services/xp_ledger.service.js";
import { validateSubmitPayload } from "../validator/submitLesson.payload.validator.js";

/**
 * @author Zio Kandaka
 * @description Return lessons with completion/progress status
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
export async function getLessons(req, res, next) {
    try {
        const { user_id } = req.query
        if (!user_id) throw { name: 'MissingParameter' };

        let lessons = await queryLessonsWithProgress(user_id)

        res.status(200).json(lessons)
    } catch (error) {
        console.log(`[getLessons] Error: ${error.name}`);
        next(error)
    }
}

/**
 * @author Zio Kandaka
 * @description Get lesson with problems and options
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
export async function getLessonById(req, res, next) {
    try {
        const { lesson_id } = req.params;
        if (!lesson_id) throw { name: 'MissingParameter' };

        const lesson = await queryLessonWithProblems(lesson_id);
        if (!lesson) throw { name: 'NotFound' };

        res.status(200).json(lesson);
    } catch (error) {
        console.log(`[getLessonById] Error: ${error.name}`);
        next(error);
    }
}

/**
 * @author Zio Kandaka
 * @description  
 * * Handles a full lesson submission.
 * POST /api/lessons/:lesson_id/submit
 * - Idempotent via attempt_id + answers_fingerprint:
 *   same payload → returns prior result; different payload → 409 AttemptMismatch.
 * - Validates full-set answers (no partials), membership, duplicates, and type-shape:
 *   MC => selected_option_id only; INPUT => input_value only.
 * - Scores: MC by problem_options.is_correct; INPUT by strict trimmed string match
 *   against problems.correct_input_value.
 * - Single transaction writes: submissions, submission_answers, xp_ledger,
 *   user_stats (XP & streak), user_progress (best-of).
 * - 200 response: { idempotent, earned_xp, correct_count, streak, progress }.
 * - Errors: 400 (MissingParameter|ValidationError), 404 (notFound), 409 (AttemptMismatch), 500 (default).
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
export async function submitLesson(req, res, next) {
    let transaction = await sequelize.transaction();

    try {
        const lesson_id = Number(req.params.lesson_id);
        // const { user_id, attempt_id, answers } = req.body;

        const { user_id, attempt_id, answers } = await validateSubmitPayload(req.body)

        if (!user_id || !attempt_id || !Array.isArray(answers)) {
            throw { name: 'MissingParameter', message: 'user_id, attempt_id, and answers required' };
        }
        if (!lesson_id) {
            throw { name: 'MissingParameter', message: 'lesson_id param required' };
        }

        const user = await queryUserById(user_id);
        if (!user) throw { name: 'NotFound', message: 'User with given ID does not exist' };

        const normalized = answers
            .map(a => ({
                problem_id: Number(a.problem_id),
                selected_option_id: a.selected_option_id != null ? Number(a.selected_option_id) : null,
                input_value: a.input_value != null ? String(a.input_value).trim() : null,
            }))
            .sort((x, y) => x.problem_id - y.problem_id);

        const answers_fingerprint = getHash('sha256', JSON.stringify(normalized));

        const existing = await checkAttemptedSubmission(attempt_id, transaction);
        if (existing) {
            if (existing.answers_fingerprint === answers_fingerprint) {
                const result = await prepareSubmissionResult(
                    user_id, lesson_id, user.email, existing.earned_xp, existing.correct_count, transaction
                );

                await transaction.commit()

                return res.status(200).json(result); //MUST use return to stop process
            }
            throw { name: 'AttemptMismatch' };
        }

        const lesson = await queryLessonWithCorrectAnswers(lesson_id);
        if (!lesson) throw { name: 'NotFound', message: `Lesson with ID ${lesson_id} not found or unpublished` };

        const problems = lesson.Problems || [];
        if (answers.length !== problems.length) {
            throw {
                name: 'ValidationError',
                message: `All problems must be answered. Submitted ${answers.length} of ${problems.length}.`
            };
        }

        const problemsById = new Map(problems.map(p => [Number(p.problem_id), p]));
        const seen = new Set();
        for (const a of answers) {
            const pid = Number(a.problem_id);
            if (!pid) {
                throw { name: 'InvalidParameterType', message: `Invalid type of problem_id: ${typeof a.problem_id}` };
            }
            if (!problemsById.has(pid)) {
                throw { name: 'ValidationError', message: `problem_id ${a.problem_id} is not part of this lesson` };
            }
            if (seen.has(pid)) {
                throw { name: 'ValidationError', message: `Duplicate answer for problem_id: ${pid}` };
            }
            seen.add(pid);

            const problem = problemsById.get(pid);
            const hasOption = a.selected_option_id != null;
            const hasInput = a.input_value != null && String(a.input_value).trim() !== '';

            if (problem.type === 'multiple_choice') {
                if (!hasOption || hasInput) {
                    throw { name: 'ValidationError', message: `Problem ${pid} expects selected_option_id only` };
                }
            } else {
                if (!hasInput || hasOption) {
                    throw { name: 'ValidationError', message: `Problem ${pid} expects input_value only` };
                }
            }
        }

        let correct_count = 0;
        let earned_xp = 0;
        let existing_correct_answer = await queryExistingCorrectAnswerOfLesson(lesson_id, transaction)

        const detailed = normalized.map(a => {
            const problem = problemsById.get(a.problem_id);

            let is_correct = false;
            if (problem.type === 'multiple_choice') {
                const opt = (problem.ProblemOptions || []).find(
                    o => Number(o.problem_option_id) === a.selected_option_id
                );
                if (!opt) {
                    throw { name: 'ValidationError', message: `selected_option_id ${a.selected_option_id} not in problem ${a.problem_id}` };
                }
                is_correct = Boolean(opt.is_correct);
            } else {
                const expected = (problem.correct_input_value ?? '').trim();
                const got = (a.input_value ?? '').trim();
                is_correct = (got === expected);
            }

            let awarded_xp = 0
            if (is_correct && !existing_correct_answer.has(Number(a.problem_id))) {
                awarded_xp = problem.xp_value
            }

            if (is_correct) { correct_count += 1; earned_xp += awarded_xp; }

            return {
                problem_id: a.problem_id,
                selected_option_id: a.selected_option_id,
                input_value: a.input_value,
                is_correct,
                awarded_xp
            };
        });

        const activity_utc_date = getUtcDate();
        const submission = await insertSubmission(
            attempt_id, user_id, lesson_id, activity_utc_date,
            correct_count, earned_xp, answers_fingerprint, 1, user.email, transaction
        );

        const answersRows = detailed.map(d => ({
            submission_id: submission.submission_id,
            problem_id: d.problem_id,
            selected_option_id: d.selected_option_id,
            input_value: d.input_value,
            is_correct: d.is_correct,
            awarded_xp: d.awarded_xp,
            created_by: user.email,
            updated_by: user.email,
        }));
        await bulkInsertSubmissionAnswer(answersRows, transaction);

        await insertXpLedger(user_id, 'submission', submission.submission_id, earned_xp, user.email, transaction);

        await updateUserStatAfterSubmit(user_id, user.email, activity_utc_date, earned_xp, transaction);
        await updateUserProgressAfterSubmit(user_id, lesson_id, problems.length, user.email, correct_count, transaction);

        const result = await prepareSubmissionResult(
            user_id, lesson_id, user.email, earned_xp, correct_count, transaction
        );

        await transaction.commit();
        return res.status(200).json(result);

    } catch (error) {
        console.log(`[submitLesson] Error: ${error.name}`);
        await transaction.rollback()
        next(error);
    }
}

