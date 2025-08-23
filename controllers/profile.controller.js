import { queryAllUserProgress } from '../services/user_progress.service.js';
import { queryUserStat } from '../services/user_stat.service.js';

/**
 * @author Zio Kandaka
 * @description Return user stats (total XP, current/best streak, progress percentage)
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
export async function getProfile(req, res, next) {
    try {
        const { user_id } = req.query;
        if (!user_id) throw { name: 'MissingParameter' };

        let stats = await queryUserStat(user_id)
        let progress = await queryAllUserProgress(user_id)

        let data = {
            ...stats,
            progress: progress
        }

        res.status(200).json(data);
    } catch (err) {
        next(err);
    }
}
