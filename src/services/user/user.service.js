import { db } from "../../db/index.js";
import { 
    getSingleUserQuery, 
    getAllUserQuery,
    userSkillUpdateQuery,
    skillInsertQuery 
} from "../../db/queries/user.js";
import { 
    formatUserRes,
    formatAllUserRes,
    constructUpdateQuery,
    constructSkillInsertQuery
} from "./user.util.js";

// Query for ALL users
const getAllUsers = async (req, res) => {
    db.all(
        getAllUserQuery,
        [],
        (err, rows) => {
            if (err) throw err
            else {
                res.send(formatAllUserRes(rows))
            }
        }
    )
}

// Query for specific user
const getUser = async (req, res) => {
    db.all(
        getSingleUserQuery,
        [req.params.userID],
        (err, rows) => {
            if (err) throw err
            else {
                res.send(formatUserRes(rows))
            }
        }
    )
}

// Partial-update for specific users
const updateUser = async (req, res) => {
    const [userUpdateQuery, userUpdateParams] = constructUpdateQuery(req)
    const [skillInsertQuery, skillParams] = constructSkillInsertQuery(req)

    const skills = req.body.skills;

    const skillParamsStr = '(' + skillParams.toString() + ')';

    // Since we execute this multiple times, preparing this improves the performance of this query
    let userSkillUpdateQueryStatement = db.prepare(userSkillUpdateQuery)

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
        .run(
            skillInsertQuery,
            [],
            (err) => {
                if (err) throw err
            }
        )
        .all(
            getSingleUserQuery,
            [req.params.userID],
            (err, rows) => {
                if (err) throw err
                else {
                    res.send(formatUserRes(rows))
                }
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
    })
}

export {  
    getAllUsers,
    getUser,
    updateUser
}
