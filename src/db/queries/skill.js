export const getQuery = `
    SELECT s.name AS name, COUNT(us.skillID) AS frequency 
    FROM user_skills AS us
    JOIN skill s ON s.id = us.skillID
    GROUP BY us.skillID
    HAVING (COUNT(us.skillID) >= (?) AND COUNT(us.skillID) <= (?))
`