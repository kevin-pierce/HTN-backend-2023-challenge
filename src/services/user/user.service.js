import { db } from "../../db/index.js";

// Query for ALL users
const getAllUsers = async (req, res) => {
    const query = `SELECT id, name, company, phone, email, us.skillID, us.rating FROM user 
                    JOIN user_skills us ON user.id = us.userID`

    db.all(
        query,
        [],
        (err, rows) => {
            if (err) throw err
            else {
                let formattedRes = new Map();
                // Process the rows
                rows.forEach((row) => {
                    if (!formattedRes.has(row.id)) {
                        let user = {
                            name: row.name,
                            company: row.company,
                            email: row.email,
                            phone: row.phone,
                            skills: [{
                                skill: row.skillID,
                                rating: row.rating,
                            }]
                        }
                        formattedRes.set(row.id, user)
                    }
                    else {
                        let user = formattedRes.get(row.id)

                        user.skills.push({
                            skill: row.skillID,
                            rating: row.rating
                        })
                    }
                })
                res.send(Object.values(Object.fromEntries(formattedRes)))
            }
        }
    )
}

// Query for specific user
const getUser = async (req, res) => {
    const query = `SELECT id, name, company, phone, email, us.skillID, us.rating FROM user 
                    JOIN user_skills us ON user.id = us.userID
                    WHERE user.id = ?`

    db.all(
        query,
        [req.params.userID],
        (err, rows) => {
            if (err) throw err
            else {
                let skills = []

                // Compress all skils into a single array
                rows.forEach((row) => {
                    skills.push({
                        skill: row.skillID,
                        rating: row.rating,
                    })
                })

                // Return formatted object
                res.send({
                    name: rows[0].name,
                    company: rows[0].company,
                    phone: rows[0].phone,
                    email: rows[0].email,
                    skills: skills
                })
            }
        }
    )
}

// Partial-update for specific users
const updateUser = async (req, res) => {
    // Initialize our query string + params list
    const getQuery = `SELECT id, name, company, phone, email, us.skillID, us.rating FROM user 
                      JOIN user_skills us ON user.id = us.userID
                      WHERE user.id = ?`


    let userPutQuery = `UPDATE user SET `
    let params = []

    // Create a placeholder for each field passed into the query
    // We update all fields that are NOT skills-related here
    for (const [field, val] of Object.entries(req.body)) {
        if (field != 'skills') {
            userPutQuery += `${field} = ? `
            params.push(val)
        }
    }

    // Add the ID specifier for the user at the end, and add their ID as a param
    userPutQuery += `WHERE id = ?;`
    params.push(req.params.userID)

    // Query for updating skills in skill table
    let skillPutQuery = `INSERT or IGNORE INTO skill (name) VALUES (?)`
    let skills = [...req.body.skills]
    let skillsToInsert = skills.map((s) => s.skill)

    // Query + statement for updating the individual skills in the mapped table
    let userSkillUpdateQuery = `INSERT INTO user_skills (userID, skillID, rating) VALUES (?, ?, ?)
                                ON CONFLICT (userID, skillID) DO UPDATE SET rating = ?`

    let userSkillUpdateQueryStatement = db.prepare(userSkillUpdateQuery)

    // We want these queries to run SEQUENTIALLY, in order
    db.serialize(() => {
        db.run(
            userPutQuery,
            params,
            (err) => {
                if (err) throw err
            }
        )
        .run(
            skillPutQuery,
            [skillsToInsert],
            (err) => {
                if (err) throw err
            }
        )
        .all(
            getQuery,
            [req.params.userID],
            (err, rows) => {
                if (err) throw err
                else {
                    let skills = []
    
                    // Compress all skils into a single array
                    rows.forEach((row) => {
                        skills.push({
                            skill: row.skillID,
                            rating: row.rating,
                        })
                    })
    
                    // Return formatted object
                    res.send({
                        name: rows[0].name,
                        company: rows[0].company,
                        phone: rows[0].phone,
                        email: rows[0].email,
                        skills: skills
                    })
                }
            }
        )
    })

    skills.forEach((skill) => {
        userSkillUpdateQueryStatement.run(
            [req.params.userID, skill.skill, skill.rating], 
            (err) => { if (err) throw err }
        )
    })
}

export {  
    getAllUsers,
    getUser,
    updateUser
}
