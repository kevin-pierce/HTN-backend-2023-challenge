import { db } from "../../db/index.js";
import { 
    registerUserQuery, 
    unregisterUserQuery 
} from "../../db/queries/registration.js";

// Set a user's registration status to TRUE
export const registerUser = async (req, res) => {
    db.run(
        registerUserQuery,
        [req.params.userID],
        (err) => {
            if (err) throw err
            res.sendStatus(200)
        }
    )
}

// Set a user's registration status to FALSE
export const unregisterUser = async (req, res) => {
    db.run(
        unregisterUserQuery,
        [req.params.userID],
        (err) => {
            if (err) throw err
            res.sendStatus(200)
        }
    )
}
