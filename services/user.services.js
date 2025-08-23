import db from "../models/index.js";

export async function queryUserById(user_id) {
    return db.User.findOne({
        where: {user_id: user_id},
        attributes: ["user_id", "display_name", "email"]
    })
}