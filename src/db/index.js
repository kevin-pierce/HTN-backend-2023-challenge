import sqlite3 from "sqlite3";
import { mockHackers } from "../../data/mockHackers.js";
import { 
    userTableSchemaCreation,
    skillTableSchemaCreation,
    skillToUserTableSchemaCreation 
} from './init.js';

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
                        let userQuery = `INSERT or IGNORE INTO user (name, company, email, phone) VALUES (?, ?, ?, ?)`
                        let skillQuery = `INSERT or IGNORE INTO skill (name) VALUES (?)`
            
                        let userStatement = db.prepare(userQuery)
                        let skillStatement = db.prepare(skillQuery)
            
                        mockHackers.forEach((hacker) => {
                            userStatement.run([hacker.name, hacker.company, hacker.email, hacker.phone], (err) => {
                                if (err) throw err
                            })
            
                            hacker.skills.forEach((skill) => {
                                skillStatement.run([skill.skill], (err) => {
                                    if (err) throw err
                                })
                            })
                        })
                        userStatement.finalize()
                        skillStatement.finalize()
            
                        let userSkillQuery = `INSERT or IGNORE INTO user_skills VALUES (?, ?, ?)`
                        let userSkillStatement = db.prepare(userSkillQuery)
            
                        // This is a VERY bad assumption ; however, due to time constraints I implemented
                        // the population logic this way
                        // Since we cannot access the hacker DB-assigned id without making another query
                        // We instead iterate over the numbers from 1 -> sizeOfHackersData to populate this field
                        // We note that this is VERY hacky and not ideal in prod
                        for (let i = 0 ; i < mockHackers.length; ++i) {
                            let hacker = mockHackers[i]
                            let hackerId = i + 1;
            
                            hacker.skills.forEach((skill) => {
                                userSkillStatement.run([hackerId, skill.skill, skill.rating], (err) => {
                                    if (err) throw err
                                })
                            })
                        }
                        userSkillStatement.finalize()
                    }
                }
            )
        })
    }
});
