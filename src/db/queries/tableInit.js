// Table creation for user table
export const userTableSchemaCreation = `
    CREATE TABLE user (
        id INTEGER PRIMARY KEY,
        name TEXT, 
        company TEXT,
        email TEXT, 
        phone TEXT,
        isRegistered INTEGER DEFAULT FALSE
    )
`

// Table creation for skill table
export const skillTableSchemaCreation = `
    CREATE TABLE skill (
        id INTEGER PRIMARY KEY,
        name TEXT UNIQUE
    )
`

// Table creation for userToSkill mapping table
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