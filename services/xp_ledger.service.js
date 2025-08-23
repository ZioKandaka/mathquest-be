import db from "../models/index.js";

export async function insertXpLedger(user_id, source_type, source_id, amount, created_by, transaction) {
    return db.XpLedger.create(
        {
            user_id: user_id,
            source_type: source_type,
            source_id: source_id,
            amount: amount,
            created_by: created_by
        },
        { transaction: transaction }
    )
}