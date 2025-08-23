import { queryLessonsWithProgress, queryLessonWithProblems } from "../services/lesson.services.js"

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
    } catch (error) { next(error); }
}