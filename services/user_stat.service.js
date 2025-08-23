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

export async function findOrCreateUserStat(user_id, created_by, transaction) {
    const [row] = await db.UserStats.findOrCreate({
        where: { user_id },
        defaults: {
            user_id,
            total_xp: 0,
            current_streak: 0,
            best_streak: 0,
            last_active_utc_date: null,
            created_by: created_by,
        },
        transaction,
        lock: transaction.LOCK.UPDATE,
    });
    return row;
}

export async function updateUserStatAfterSubmit(user_id, updated_by, activity_utc_date, earned_xp, transaction) {
    const stats = await findOrCreateUserStat(user_id, updated_by, transaction);
    const last_day = stats.last_active_utc_date; // may be null
    const today = activity_utc_date;
    let current = stats.current_streak;
    let best = stats.best_streak;

    if (last_day !== today) {
        // check if yesterday
        const yesterday = new Date(Date.parse(today));
        yesterday.setUTCDate(yesterday.getUTCDate() - 1);
        const yyyymmdd = yesterday.toISOString().slice(0, 10);

        if (last_day === yyyymmdd) {
            current = current + 1;
        } else {
            current = 1;
        }
    }

    if (current > best) best = current;

    await stats.update({
        total_xp: stats.total_xp + earned_xp,
        current_streak: current,
        best_streak: best,
        last_active_utc_date: today,
        updated_by: updated_by,
    }, { transaction: transaction });
}