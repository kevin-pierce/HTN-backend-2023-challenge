// Query for getting all users + their skills
export const getAllUserQuery = `
    SELECT u.id, u.name as userName, u.company, u.phone, u.email, s.name as skillName, us.rating 
    FROM user as u 
    JOIN user_skills us ON u.id = us.userID
    JOIN skill s ON us.skillID = s.id
`

// Query for getting a specific user + their skills
export const getSingleUserQuery = getAllUserQuery + ` WHERE u.id = ?`

// Query for updating the individual skills in the mapped table
export const userSkillUpdateQuery = `
    INSERT INTO user_skills (userID, skillID, rating) VALUES (?, ?, ?)
    ON CONFLICT (userID, skillID) DO UPDATE SET rating = ?
`

// Query for inserting new skills into the skill table
export const skillInsertQuery = `
    INSERT INTO skill (name) VALUES (?)
    ON CONFLICT (name) DO NOTHING                             
`