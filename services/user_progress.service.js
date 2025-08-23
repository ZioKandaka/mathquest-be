import db from '../models/index.js';

export async function queryAllUserProgress(user_id) {
    return db.UserProgress.findAll({
        where: { user_id: user_id },
        attributes: ["user_progress_id", "lesson_id", "problems_total", "best_correct_count", "progress_fraction", "completed", "last_submitted_at"],
        order: ["created_at"]
    })
}