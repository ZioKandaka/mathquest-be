import db from '../models/index.js';

export async function getLessonsWithProgress(user_id) {
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

export async function getLessonWithProblems(lesson_id) {
    return db.Lesson.findOne({
        where: { lesson_id: lesson_id, is_published: true },
        attributes: ['lesson_id', 'title', 'description'],
        include: [{
            model: db.Problem,
            attributes: ['problem_id', 'type', 'prompt'],
            required: false,
            order: ["position"],
            include: [{
                model: db.ProblemOption,
                attributes: ['problem_option_id', 'body'],
                order: ["position"],
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
