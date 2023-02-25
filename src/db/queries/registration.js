// Query for getting a user's registration status
export const getRegistrationStatusQuery = `
    SELECT u.isRegistered 
    FROM user AS u 
    WHERE u.id = ?
`
// Query for setting a user to REGISTERED
export const registerUserQuery = `
    UPDATE user
    SET isRegistered = 1
    WHERE id = ?
`

// Query for unregistering a user
export const unregisterUserQuery = `
    UPDATE user
    SET isRegistered = 0
    WHERE id = ?
`