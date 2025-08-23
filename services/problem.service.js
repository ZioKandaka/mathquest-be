import db from "../models/index.js";

export async function countProblemByLessonId(lesson_id) {
    return db.Problem.count({
        where: { lesson_id: lesson_id }
    })
}