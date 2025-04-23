require('dotenv').config()

const mysql = require('mysql2/promise')
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

async function fetchAllItems(tableName) {    

    var result = []

    // Turns out we have to wrap fetching of promises in try catch blocks to actually wait for the data, then return it via the 'finally' block
    // Statement above is wrong. I actually did not declare the function caller an 'async' function, thus not waiting for the returned promise

    // The function caller and function receiver have to be both async so they can communicate in promises

    var queryString = `SELECT * FROM ${tableName}`
    var queryResult = []
    
    var queryResults = await (await sqlCon).query(queryString) // Quite a doozy this line is. Two awaits?? Have to conver the SQL object to an SQL Promise object then await it?
        .then( ([rows]) => { 

            result = rows
        } )

    return (result)
}

async function addItem(item, tableName) {

    var queryString = `INSERT INTO ${tableName} (title, game_description, thoughts, box_art) VALUES ("${item.title}", "${item.gameDescription}", "${item.thoughts}", "${item.boxArt}")`

    var queryResults = await (await sqlCon).query(queryString)

    return queryResults
}

async function updateItem(tableName, item) {

    var queryCollection = []

    // Iterate through item object to get keys and values, then append the formatted string to queryCollection
    for (let [key, val] of Object.entries(item)) {

        if (key != "id") {

            queryCollection.push(`${key} = "${val}"`)
        }        
    }

    var updateQuerySubstr = queryCollection.join(', ')
    var queryString = `UPDATE ${tableName} SET ${updateQuerySubstr} WHERE id = ${item.id}`

    var queryResults = await (await sqlCon).query(queryString)

    return queryResults
}

async function deleteItem(tableName, itemId) {

    var queryString = `DELETE FROM ${tableName} WHERE id = ${itemId}`

    var queryResults = await (await sqlCon).query(queryString)

    return queryResults
}

module.exports = {

    fetchAllItems,
    addItem,
    updateItem,
    deleteItem
}