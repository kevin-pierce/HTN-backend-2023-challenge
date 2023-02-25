// Query for setting a user to REGISTERED
export const registerUserQuery = `
    UPDATE user
    SET isRegistered = TRUE
    WHERE id = ?
`

// Query for unregistering a user
export const unregisterUserQuery = `
    UPDATE user
    SET isRegistered = FALSE
    WHERE id = ?
`