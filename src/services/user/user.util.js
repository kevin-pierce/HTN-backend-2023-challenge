/* File consisting of helpers used by the user service */

// Helper for formatting the response of a SINGLE USER get request
export const formatUserRes = (rows) => {
    let skills = []

    // Compress all skils into a single array
    rows.forEach((row) => {
        skills.push({
            name: row.skillName,
            rating: row.rating,
        })
    })

    // Return formatted object
    return {
        name: rows[0].userName,
        company: rows[0].company,
        phone: rows[0].phone,
        email: rows[0].email,
        skills: skills
    }
}

// Helper for formatting the response of the ALL USER get request
export const formatAllUserRes = (rows) => {

    // Our query returns duplicate entries for each user (with differing skills)
    // We use a map to map each individual user (prevent duplicate user entries)
    let formattedRes = new Map();
    // Process the rows
    rows.forEach((row) => {
        if (!formattedRes.has(row.id)) {
            let user = {
                name: row.userName,
                company: row.company,
                phone: row.phone,
                email: row.email,
                skills: [{
                    name: row.skillName,
                    rating: row.rating,
                }]
            }
            formattedRes.set(row.id, user)
        }
        else {
            let user = formattedRes.get(row.id)

            user.skills.push({
                name: row.skillName,
                rating: row.rating
            })
        }
    })
    return Object.values(Object.fromEntries(formattedRes))
}

// Helper used to construct the partial update query for users
export const constructUpdateQuery = (req) => {
    let userUpdateQuery = `UPDATE user SET `
    let updateParams = []

    // Create a placeholder for each field passed into the query
    // We update all fields that are NOT skills-related here
    for (const [field, val] of Object.entries(req.body)) {
        if (field != 'skills') {
            userUpdateQuery += `${field} = ? `
            updateParams.push(val)
        }
    }

    // Add the ID specifier for the user at the end, and add their ID as a param
    userUpdateQuery += `WHERE id = ?;`
    updateParams.push(req.params.userID)
    return [userUpdateQuery, updateParams]
}

// Helper used to construct the partial update query for users
export const constructSkillInsertQuery = (req) => {
    const skillsToInsert = [...req.body.skills].map((s) => '\'' + s.skill + '\'')

    //  VALUES (?)
    // ON CONFLICT (name) DO NOTHING         

    let skillInsertQuery = `INSERT INTO skill (name) VALUES `
    
    skillsToInsert.forEach((skill, i) => {
        skillInsertQuery += `(${skill})`
        if (i < skillsToInsert.length - 1) {
            skillInsertQuery += `, `
        }
    })
    skillInsertQuery += ` ON CONFLICT (name) DO NOTHING `

    return [skillInsertQuery, skillsToInsert]
}
