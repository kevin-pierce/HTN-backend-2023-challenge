export const userTableSchemaCreation = `
    CREATE TABLE user (
        id INTEGER PRIMARY KEY,
        name TEXT, 
        company TEXT,
        email TEXT, 
        phone TEXT,
        isRegistered INTEGER
    )
`

export const skillTableSchemaCreation = `
    CREATE TABLE skill (
        id INTEGER PRIMARY KEY,
        name TEXT UNIQUE
    )
`
export const skillToUserTableSchemaCreation = `
    CREATE TABLE user_skills (
        userID INTEGER,
        skillID INTEGER,
        rating INTEGER,
        CONSTRAINT userToSkill PRIMARY KEY (userID, skillID),
        FOREIGN KEY (userID) references user(id),
        FOREIGN KEY (skillID) references skill(id)
    )
`