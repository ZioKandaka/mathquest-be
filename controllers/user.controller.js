import { queryAllUsers } from "../services/user.service.js";

/**
 * @author Zio Kandaka
 * @description Return user lists
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
export async function getAllUsers(req, res, next) {
    try {
        let users = await queryAllUsers()

        res.status(200).json(users);
    } catch (err) {
        console.log(`[getAllUsers] Error: ${err.name}`);
        next(err);
    }
}
