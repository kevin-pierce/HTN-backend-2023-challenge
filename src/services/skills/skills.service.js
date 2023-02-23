import { db } from "../../db/index.js";

// Query for specific skill + number aggregation
const getSkills = async (req, res) => {
    let minCount = req.query.min_frequency ? parseInt(req.query.min_frequency) : 0
    let maxCount = req.query.max_frequency ? parseInt(req.query.max_frequency) : Number.MAX_SAFE_INTEGER

    const query = `SELECT skillID as name, COUNT(skillID) as frequency from user_skills 
                   GROUP BY skillID
                   HAVING (COUNT(skillID) >= (?) AND COUNT(skillID) <= (?))`

    db.all(
        query,
        [minCount, maxCount],
        (err, rows) => {
            if (err) throw err
            else {
                res.send(rows)
            }
        }
    )
}

export {
    getSkills
}