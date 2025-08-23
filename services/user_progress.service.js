import db from '../models/index.js';

export async function queryAllUserProgress(user_id) {
    return db.UserProgress.findAll({
        where: { user_id: user_id },
        attributes: ["user_progress_id", "lesson_id", "problems_total", "best_correct_count", "progress_fraction", "completed", "last_submitted_at"],
        order: ["created_at"]
    })
}

export async function findOrCreateUserProgress(user_id, lesson_id, problems_total, created_by, transaction) {
    return await db.UserProgress.findOrCreate({
        where: { user_id, lesson_id },
        defaults: {
            user_id,
            lesson_id,
            problems_total,
            best_correct_count: 0,
            progress_fraction: 0,
            completed: false,
            last_submitted_at: null,
            created_by: created_by,
        },
        transaction,
        lock: transaction.LOCK.UPDATE,
    });
}

export async function updateUserProgressAfterSubmit(user_id, lesson_id, problems_total, updated_by, correct_count, transaction) {
    const [progress, is_created] = await findOrCreateUserProgress(user_id, lesson_id, problems_total, updated_by, transaction);

    const newBest = Math.max(progress.best_correct_count, correct_count);
    const fraction = newBest / problems_total;
    const completed = newBest === problems_total;

    return await progress.update({
        problems_total: problems_total,
        best_correct_count: newBest,
        progress_fraction: fraction,
        completed,
        last_submitted_at: new Date(),
        updated_by: updated_by,
    }, { transaction: transaction });
}