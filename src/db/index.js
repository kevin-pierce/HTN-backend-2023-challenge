import sqlite3 from "sqlite3";
import { mockHackers } from "../../data/mockHackers.js";
import { 
    userTableSchemaCreation,
    skillTableSchemaCreation,
    skillToUserTableSchemaCreation 
} from './queries/tableInit.js';

export const db = new sqlite3.Database('hackers.db', (err) => {
    if (err) {
      // Cannot open database
      console.error(err.message)
      throw err
    }else{
        console.log('Connected to the SQLite database.')
        // Table creation + data initialization
        db.serialize(() => {
            db.run(
                userTableSchemaCreation,
                (err) => { if (err) {} }
            )
            .run(
                skillTableSchemaCreation,
                (err) => { if(err) {} }
            )
            .run(
                skillToUserTableSchemaCreation,
                (err) => {
                    if (!err) {
                        // Populate users + the skills
                        const userInsertQuery = `INSERT or IGNORE INTO user (name, company, email, phone) VALUES (?, ?, ?, ?)`
                        const skillInsertQuery = `INSERT or IGNORE INTO skill (name) VALUES (?)`
                        const userSkillInsertQuery = `INSERT or IGNORE INTO user_skills VALUES (?, ?, ?)`

                        // Iterate over all hackers
                        mockHackers.forEach((hacker) => {
                            // Initialize hackerID and skillID to be the DB-assigned IDs of each hacker and skill entered ; used in user:skill map
                            let hackerID;
                            let skillID;
                            db.serialize(() => {

                                // Run query for user insertion
                                db.run(
                                    userInsertQuery,
                                    [hacker.name, hacker.company, hacker.email, hacker.phone], 
                                    function (err) {
                                        if (err) throw err
                                        hackerID = this.lastID
                                    }
                                )
                
                                hacker.skills.forEach((skill) => {
                                    // Run the query for skill insertion
                                    db.run(
                                        skillInsertQuery,
                                        [skill.skill], 
                                        function (err) {
                                            if (err) throw err
                                            skillID = this.lastID
                                            
                                            // Run the query responsible for creating the user:skill mapping
                                            db.run(
                                                userSkillInsertQuery,
                                                [hackerID, skillID, skill.rating],
                                                (err) => {if (err) throw err }
                                            )
                                        }
                                    )
                                })
                            })
                        })
                    }
                }
            )
        })
    }
});
