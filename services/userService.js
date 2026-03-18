import pool from "../database/postgres.js"


/* =========================
GET USER
========================= */

export async function getUser(phone) {

    const result = await pool.query(
        "SELECT * FROM users WHERE phone = $1",
        [phone]
    )

    return result.rows[0] || null
}



/* =========================
CREATE USER (SAFE)
========================= */

export async function createUser(phone) {

    const existing = await getUser(phone)

    if(existing) return existing

    const result = await pool.query(
        `INSERT INTO users (phone, state, language)
         VALUES ($1, 'new_user', 'english')
         RETURNING *`,
        [phone]
    )

    return result.rows[0]
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
START TRIAL (SAFE - ONLY ONCE)
========================= */

export async function updateTrial(phone) {

    const user = await getUser(phone)

    // Prevent resetting trial again
    if(user?.trial_start) return

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

/* =========================
SAVE TRANSACTION
========================= */

export async function saveTransaction(phone, type, amount, description) {

    await pool.query(
        `INSERT INTO transactions (phone, type, amount, description)
         VALUES ($1, $2, $3, $4)`,
        [phone, type, amount, description]
    )

}

/* =========================
GET REPORT
========================= */

export async function getReport(phone){

    const result = await pool.query(
        `
        SELECT 
        SUM(CASE WHEN type='sale' THEN amount ELSE 0 END) as total_sales,
        SUM(CASE WHEN type='expense' THEN amount ELSE 0 END) as total_expense,
        SUM(CASE WHEN type='udhar' THEN amount ELSE 0 END) as total_udhar
        FROM transactions
        WHERE phone = $1
        `,
        [phone]
    )

    return result.rows[0]

}

/* =========================
SAVE UDHAR
========================= */

export async function saveUdhar(phone, customer, amount){

    await pool.query(
        `INSERT INTO "Udhar" (phone, customer_name, amount, status)
         VALUES ($1, $2, $3, 'pending')`,
        [phone, customer, amount]
    )

}



/* =========================
GET UDHAR SUMMARY
========================= */

export async function getUdharSummary(phone){

    const result = await pool.query(
        `
        SELECT 
        customer_name,
        SUM(amount) as total
        FROM "Udhar"
        WHERE phone = $1 AND status = 'pending'
        GROUP BY customer_name
        ORDER BY total DESC
        `,
        [phone]
    )

    return result.rows

}

/* =========================
MARK UDHAR AS PAID
========================= */

export async function markUdharPaid(phone, customer){

    await pool.query(
        `
        UPDATE "Udhar"
        SET status = 'paid'
        WHERE phone = $1 
        AND customer_name ILIKE $2
        AND status = 'pending'
        `,
        [phone, customer]
    )

}



/* =========================
GET PENDING UDHAR
========================= */

export async function getPendingUdhar(phone){

    const result = await pool.query(
        `
        SELECT customer_name, SUM(amount) as total
        FROM "Udhar"
        WHERE phone = $1 AND status = 'pending'
        GROUP BY customer_name
        ORDER BY total DESC
        `,
        [phone]
    )

    return result.rows

}