import { db } from "../../db/index.js";
import { getQuery } from "../../db/queries/skill.js";

// Query for specific skill + number aggregation
export const getSkills = async (req, res) => {
    // Obtain min and max counts from the request
    let minCount = req.query.min_frequency ? parseInt(req.query.min_frequency) : 0
    let maxCount = req.query.max_frequency ? parseInt(req.query.max_frequency) : Number.MAX_SAFE_INTEGER

    db.all(
        getQuery,
        [minCount, maxCount],
        (err, rows) => {
            if (err) throw err
            else {
                res.send(rows)
            }
        }
    )
}
