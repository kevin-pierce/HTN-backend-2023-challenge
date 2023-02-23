export const userTableSchemaCreation = `
    CREATE TABLE user (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name text, 
        company text,
        email text, 
        phone text
    )
`

export const skillTableSchemaCreation = `
    CREATE TABLE skill (
        name text PRIMARY KEY
    )
`
export const skillToUserTableSchemaCreation = `
    CREATE TABLE user_skills (
        userID INTEGER,
        skillID text,
        rating INTEGER,
        CONSTRAINT userToSkill PRIMARY KEY (userID, skillID),
        FOREIGN KEY (userID) references user(id),
        FOREIGN KEY (skillID) references skill(name)
    )
`