import pool from "../database/postgres.js"


export async function getUserByPhone(phone){

const result = await pool.query(
"SELECT * FROM users WHERE phone = $1",
[phone]
)

return result.rows[0]

}



export async function createUser(user){

const { phone, state } = user

await pool.query(
`INSERT INTO users (phone,state)
VALUES ($1,$2)`,
[phone,state]
)

}



export async function updateUser(phone,data){

const fields = Object.keys(data)
const values = Object.values(data)

const setQuery = fields
.map((field,i)=>`${field}=$${i+2}`)
.join(",")

await pool.query(
`UPDATE users SET ${setQuery}
WHERE phone=$1`,
[phone,...values]
)
}