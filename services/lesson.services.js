import db from '../models/index.js';

export async function queryLessonsWithProgress(user_id) {
    return db.Lesson.findAll({
        attributes: ['lesson_id', 'title', 'description'],
        where: { is_published: true },
        order: ['position'],
        include: [{
            model: db.UserProgress,
            attributes: ['best_correct_count', 'progress_fraction', 'completed', 'last_submitted_at'],
            required: false,
            where: { user_id },
        }],
    });
}

export async function queryLessonWithProblems(lesson_id) {
    return db.Lesson.findOne({
        where: { lesson_id: lesson_id, is_published: true },
        attributes: ['lesson_id', 'title', 'description'],
        include: [{
            model: db.Problem,
            attributes: ['problem_id', 'type', 'prompt'],
            required: false,
            include: [{
                model: db.ProblemOption,
                attributes: ['problem_option_id', 'body'],
                required: false,
            }],
        }],
        order: [
            ['position', 'ASC'],
            [db.Problem, 'position', 'ASC'],
            [db.Problem, db.ProblemOption, 'position', 'ASC'],
        ],
    });
}

export async function queryLessonById(lesson_id) {
    return db.Lesson.findOne({ lesson_id })
}

export async function queryLessonWithCorrectAnswers(lesson_id) {
    return await db.Lesson.findOne({
        attributes: ['lesson_id', 'title'],
        where: { lesson_id, is_published: true },
        include: [{
            model: db.Problem,
            attributes: [
                'problem_id',
                'type',
                'position',
                'xp_value',
                'correct_input_value'
            ],
            include: [{
                model: db.ProblemOption,
                attributes: ['problem_option_id', 'is_correct'],
                required: false,
            }],
        }],
        order: [[db.Problem, 'position', 'ASC']],
    });
}
