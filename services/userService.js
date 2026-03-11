const pool = require("../database/postgres")

async function findUser(phone) {
  const result = await pool.query(
    "SELECT * FROM users WHERE phone = $1",
    [phone]
  )
  return result.rows[0]
}

async function createUser(phone){

const trialStart = new Date()

const trialEnd = new Date()
trialEnd.setDate(trialEnd.getDate() + 14)

const result = await pool.query(
`INSERT INTO users(phone,language,state,trial_start,trial_end,subscription_status)
VALUES($1,'english','new_user',$2,$3,'trial')
RETURNING *`,
[phone,trialStart,trialEnd]
)

return result.rows[0]

}

async function updateLanguage(phone, language) {
  await pool.query(
    "UPDATE users SET language = $1 WHERE phone = $2",
    [language, phone]
  )
}

async function updateState(phone, state) {
  await pool.query(
    "UPDATE users SET state = $1 WHERE phone = $2",
    [state, phone]
  )
}

module.exports = {
  findUser,
  createUser,
  updateLanguage,
  updateState
}