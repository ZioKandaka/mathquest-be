import { getLessonsWithProgress, getLessonWithProblems } from "../services/lesson.services.js"


export async function getLessons(req, res, next) {
    try {
        const { user_id } = req.query
        if (!user_id) throw { name: 'MissingParameter' };

        let lessons = await getLessonsWithProgress(user_id)

        res.status(200).json(lessons)
    } catch (error) {
        next(error)
    }
}

export async function getLessonById(req, res, next) {
    try {
        const { lesson_id } = req.params;
        if (!lesson_id) throw { name: 'MissingParameter' };

        const lesson = await getLessonWithProblems(lesson_id);
        if (!lesson) throw { name: 'NotFound' };

        res.status(200).json(lesson);
    } catch (error) { next(error); }
}