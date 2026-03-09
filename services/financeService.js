const pool = require("../database/postgres")

async function recordSale(phone,amount,description){

await pool.query(
`INSERT INTO transactions(user_id,type,amount,description)
VALUES($1,'sale',$2,$3)`,
[phone,amount,description]
)

}

async function recordExpense(phone,amount,description){

await pool.query(
`INSERT INTO transactions(user_id,type,amount,description)
VALUES($1,'expense',$2,$3)`,
[phone,amount,description]
)

}

async function recordUdhar(phone,amount,description){

await pool.query(
`INSERT INTO transactions(user_id,type,amount,description)
VALUES($1,'udhar',$2,$3)`,
[phone,amount,description]
)

}

async function getTodayReport(phone){

const sales = await pool.query(
`SELECT COALESCE(SUM(amount),0) as total
FROM transactions
WHERE user_id=$1 AND type='sale'
AND DATE(created_at)=CURRENT_DATE`,
[phone]
)

const expenses = await pool.query(
`SELECT COALESCE(SUM(amount),0) as total
FROM transactions
WHERE user_id=$1 AND type='expense'
AND DATE(created_at)=CURRENT_DATE`,
[phone]
)

return {
sales:sales.rows[0].total,
expenses:expenses.rows[0].total
}

}

module.exports = {
recordSale,
recordExpense,
recordUdhar,
getTodayReport
}