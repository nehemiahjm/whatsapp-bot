const pool = require("../database/postgres")

/* RECORD SALE */

async function recordSale(phone, amount, description){

await pool.query(
`INSERT INTO transactions(user_id,type,amount,description)
VALUES($1,'sale',$2,$3)`,
[phone,amount,description]
)

}

/* RECORD EXPENSE */

async function recordExpense(phone, amount, description){

await pool.query(
`INSERT INTO transactions(user_id,type,amount,description)
VALUES($1,'expense',$2,$3)`,
[phone,amount,description]
)

}

/* RECORD UDHAR */

async function recordUdhar(phone, amount, description){

await pool.query(
`INSERT INTO transactions(user_id,type,amount,description)
VALUES($1,'udhar',$2,$3)`,
[phone,amount,description]
)

}

/* REPORT ENGINE */

async function getReport(phone,type){

let dateFilter = ""

if(type === "today"){

dateFilter = "AND DATE(created_at)=CURRENT_DATE"

}

if(type === "week"){

dateFilter = "AND created_at >= NOW() - INTERVAL '7 days'"

}

if(type === "month"){

dateFilter = "AND created_at >= NOW() - INTERVAL '30 days'"

}

/* SALES */

const sales = await pool.query(
`SELECT COALESCE(SUM(amount),0) as total
FROM transactions
WHERE user_id=$1 AND type='sale'
${dateFilter}`,
[phone]
)

/* EXPENSE */

const expenses = await pool.query(
`SELECT COALESCE(SUM(amount),0) as total
FROM transactions
WHERE user_id=$1 AND type='expense'
${dateFilter}`,
[phone]
)

/* UDHAR */

const udhar = await pool.query(
`SELECT COALESCE(SUM(amount),0) as total
FROM transactions
WHERE user_id=$1 AND type='udhar'
${dateFilter}`,
[phone]
)

return{

sales: sales.rows[0].total,
expenses: expenses.rows[0].total,
udhar: udhar.rows[0].total

}

}

module.exports = {

recordSale,
recordExpense,
recordUdhar,
getReport

}