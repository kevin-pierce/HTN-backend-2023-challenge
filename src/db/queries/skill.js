export const getQuery = `
    SELECT s.name as name, COUNT(us.skillID) as frequency 
    FROM user_skills as us
    JOIN skill s ON s.id = us.skillID
    GROUP BY us.skillID
    HAVING (COUNT(us.skillID) >= (?) AND COUNT(us.skillID) <= (?))
`