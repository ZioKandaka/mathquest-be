import db from "../models/index.js";

export async function bulkInsertSubmissionAnswer(answers, transaction) {
    return db.SubmissionAnswer.bulkCreate(answers, { transaction: transaction });
}