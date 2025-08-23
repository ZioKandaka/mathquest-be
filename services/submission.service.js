import db from "../models/index.js";
import { countProblemByLessonId } from "./problem.service.js";
import { findOrCreateUserProgress } from "./user_progress.service.js";
import { findOrCreateUserStat } from "./user_stat.service.js";

export async function insertSubmission(attempt_id, user_id, lesson_id, activity_utc_date, correct_count, earned_xp, answers_fingerprint, processing_version = 1, created_by, transaction) {
    return db.Submission.create(
        {
            attempt_id: attempt_id,
            user_id: user_id,
            lesson_id: lesson_id,
            submitted_at: new Date(),
            activity_utc_date: activity_utc_date,
            correct_count: correct_count,
            earned_xp: earned_xp,
            answers_fingerprint: answers_fingerprint,
            processing_version: processing_version,
            created_by: created_by,
        },
        { transaction: transaction }
    )
}

export async function checkAttemptedSubmission(attempt_id, transaction) {
    return db.Submission.findOne({
        where: { attempt_id },
        transaction: transaction,
        lock: transaction.LOCK.UPDATE,
    });
}

export async function prepareSubmissionResult(user_id, lesson_id, created_by, earned_xp, correct_count, transaction) {
    const problems = await countProblemByLessonId(lesson_id)
    const stats = await findOrCreateUserStat(user_id, created_by, transaction);
    const [progress, is_created] = await findOrCreateUserProgress(user_id, lesson_id, problems.length, created_by, transaction);

    return {
        earned_xp: Number(earned_xp),
        correct_count: Number(correct_count),
        streak: {
            current: Number(stats.current_streak),
            best: Number(stats.best_streak),
        },
        progress: {
            lesson_id: lesson_id,
            problems_total: Number(progress.problems_total),
            best_correct_count: Number(progress.best_correct_count),
            fraction: Number(progress.progress_fraction),
            completed: Boolean(progress.completed),
            last_submitted_at: progress.last_submitted_at,
        },
    };
}

export async function queryExistingCorrectAnswerOfLesson(lesson_id, transaction) {
    let subs = await db.Submission.findAll({
        where: {
            lesson_id: lesson_id
        },
        attributes: ["submission_id", "lesson_id"],
        include: [
            {
                model: db.SubmissionAnswer,
                where: { is_correct: true },
                attributes: ["problem_id", "selected_option_id", "input_value"],
                required: false
            }
        ],
        transaction: transaction
    })

    let existing_answers = new Map()
    subs.forEach(sub => {
        let answers = sub.SubmissionAnswers
        answers.forEach(ans => {
            let value = ans.selected_option_id ? ans.selected_option_id : ans.input_value
            existing_answers.set(Number(ans.problem_id), value)
        })
    })
    
    return existing_answers
}