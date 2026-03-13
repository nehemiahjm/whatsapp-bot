import pool from "../database/postgres.js"


/* =========================
GET USER
========================= */

export async function getUser(phone) {

    const result = await pool.query(
        "SELECT * FROM users WHERE phone = $1",
        [phone]
    )

    return result.rows[0]

}



/* =========================
CREATE USER
========================= */

export async function createUser(phone) {

    await pool.query(
        "INSERT INTO users (phone, state, language) VALUES ($1, 'new_user', 'english')",
        [phone]
    )

}



/* =========================
UPDATE LANGUAGE
========================= */

export async function updateUserLanguage(phone, language) {

    await pool.query(
        "UPDATE users SET language = $1 WHERE phone = $2",
        [language, phone]
    )

}



/* =========================
UPDATE STATE
========================= */

export async function updateUserState(phone, state) {

    await pool.query(
        "UPDATE users SET state = $1 WHERE phone = $2",
        [state, phone]
    )

}



/* =========================
SAVE USER NAME
========================= */

export async function updateUserName(phone, name) {

    await pool.query(
        "UPDATE users SET name = $1 WHERE phone = $2",
        [name, phone]
    )

}



/* =========================
SAVE USAGE TYPE
========================= */

export async function updateUserUsage(phone, usage) {

    await pool.query(
        "UPDATE users SET usage_type = $1 WHERE phone = $2",
        [usage, phone]
    )

}



/* =========================
SAVE BUSINESS NAME
========================= */

export async function updateUserBusiness(phone, business) {

    await pool.query(
        "UPDATE users SET business_name = $1 WHERE phone = $2",
        [business, phone]
    )

}



/* =========================
START TRIAL
========================= */

export async function updateTrial(phone) {

    const start = new Date()

    const end = new Date()

    end.setDate(start.getDate() + 14)

    await pool.query(
        `
        UPDATE users
        SET trial_start = $1,
            trial_end = $2
        WHERE phone = $3
        `,
        [start, end, phone]
    )

}