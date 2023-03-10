import { db } from "../../db/index.js";
import { 
    getSingleUserQuery, 
    getAllUserQuery,
    userSkillUpdateQuery,
    getRegistrationStatusQuery,
} from "../../db/queries/user.js";
import { 
    formatUserRes,
    formatAllUserRes,
    constructUpdateQuery,
    constructSkillInsertQuery
} from "./user.util.js";

// Query for ALL users
export const getAllUsers = async (req, res) => {
    db.all(
        getAllUserQuery,
        [],
        (err, rows) => {
            if (err) throw err
            else {
                res.status(200).send(formatAllUserRes(rows))
            }
        }
    )
}

// Query for specific user
export const getUser = async (req, res) => {
    db.all(
        getSingleUserQuery,
        [req.params.userID],
        (err, rows) => {
            if (err) throw err
            else {
                res.status(200).send(formatUserRes(rows))
            }
        }
    )
}

// Partial-update for specific users
export const updateUser = async (req, res) => {
    const [userUpdateQuery, userUpdateParams] = constructUpdateQuery(req)
    const [skillInsertQuery, skillParams] = constructSkillInsertQuery(req)

    const skills = req.body.skills ? req.body.skills : []
    let skillParamsStr
    let userSkillUpdateQueryStatement

    if (skills && skills.length > 0) {
        skillParamsStr = '(' + skillParams.toString() + ')';

        // Since we execute this multiple times, preparing this improves the performance of this query
        userSkillUpdateQueryStatement = db.prepare(userSkillUpdateQuery)
    }

    // Serialize to run these sequentially
    db.serialize(() => {
        // Update the user fields EXCEPT skills
        db.run(
            userUpdateQuery,
            userUpdateParams,
            (err) => {
                if (err) throw err
            }
        )

        // Insert new skills
        if (skills && skills.length > 0) {
            db.run(
                skillInsertQuery,
                [],
                (err) => {
                    if (err) throw err
                }
            )
            .all(
                `SELECT id FROM skill WHERE name IN ${skillParamsStr}`,
                [],
                (err, rows) => {
                    if (err) throw err;
                    rows.forEach((row, ind) => {
                        userSkillUpdateQueryStatement.run(
                            [req.params.userID, row.id, skills[ind].rating, skills[ind].rating],
                            (err) => { if (err) throw err }
                        )
                    })
                }
            )
        }
        // Final get request to obtain updated user
        db.all(
            getSingleUserQuery,
            [req.params.userID],
            (err, rows) => {
                if (err) throw err
                else {
                    res.status(200).send(formatUserRes(rows))
                }
            }
        )
    })
}

// Query for specific user's registration status
export const getRegistrationStatus = async (req, res) => {
    db.get(
        getRegistrationStatusQuery,
        [req.params.userID],
        (err, row) => {
            if (err) throw err
            else {
                res.status(200).send(row)
            }
        }
    )
}
