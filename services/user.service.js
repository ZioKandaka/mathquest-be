import db from "../models/index.js";

export async function queryAllUsers() {
    return db.User.findAll({
        attributes: ["user_id", "display_name", "email"]
    })
}