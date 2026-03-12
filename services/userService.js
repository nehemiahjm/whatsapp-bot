import pool from "../database/postgres.js"


export async function getUser(phone) {

    const result = await pool.query(
        "SELECT * FROM users WHERE phone = $1",
        [phone]
    )

    return result.rows[0]
}



export async function createUser(phone) {

    await pool.query(
        "INSERT INTO users (phone, state) VALUES ($1, 'new_user')",
        [phone]
    )
}



export async function updateUserLanguage(phone, language) {

    await pool.query(
        "UPDATE users SET language = $1 WHERE phone = $2",
        [language, phone]
    )
}



export async function updateUserState(phone, state) {

    await pool.query(
        "UPDATE users SET state = $1 WHERE phone = $2",
        [state, phone]
    )
}