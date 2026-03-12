import pool from "../database/postgres.js"

export async function getUserByPhone(phone) {

  const result = await pool.query(
    "SELECT * FROM users WHERE phone=$1",
    [phone]
  )

  return result.rows[0]

}

export async function createUser(phone) {

  await pool.query(
    "INSERT INTO users (phone) VALUES ($1)",
    [phone]
  )

}