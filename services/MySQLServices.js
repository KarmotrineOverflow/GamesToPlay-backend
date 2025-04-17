require('dotenv').config()

const mysql = require('mysql2')
const host = process.env.HOST
const user = process.env.DB_USERNAME
const password = process.env.DB_PASSWORD

const sqlCon = mysql.createConnection(
    {
        host: host,
        database: 'gamestoplay',
        user: user,
        password: password
    }
)

function fetchAllItems(tableName)
/* 

    Test

*/
{
    
    var queryString = `SELECT * FROM ${tableName}`
    
    var queryResults = sqlCon.query(queryString, (err, result) => {
    
        if (err) throw err
        console.log(result)
        res.send(result)
    })
    
    return queryResults
}