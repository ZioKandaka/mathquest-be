import db from '../models/index.js';

export async function queryUserStat(user_id) {
    let data = {
        total_xp: 0,
        current_streak: 0,
        best_streak: 0
    };

    let stat = await db.UserStats.findOne({
        attributes: ['total_xp', 'current_streak', 'best_streak'],
        where: { user_id },
        raw: true,
    })

    if (stat) {
        data.total_xp = stat.total_xp
        data.current_streak = stat.current_streak
        data.best_streak = stat.best_streak
    }

    return data
}