const sqlServices = require('../services/MySQLServices');
const templates = require('../templates/ObjectTemplates')

function retrieveGames(tableName) {

    let result = sqlServices.fetchAllItems(tableName)
    return result
}

async function addGame(tableName, gameDetails) {

    try {

        let result = await sqlServices.addItem(tableName, gameDetails)

        return result
    } catch(e) {

        throw(e)
    }
}  

async function updateGameDetails(tableName, gameDetails) {
    try {

        let result = await sqlServices.updateItem(tableName, gameDetails)

        return result
    } catch (e) {

        throw e
    }
}

async function markGameAsPlayed(gameDetails) {

    try {

        const gameId = gameDetails.id

        await sqlServices.deleteItem("toplaygames", gameId)
        await addGame("playedgames", gameDetails)

        return "Game marked as played successfully"
    } catch (e) {

        throw e
    }
}

module.exports = {

    retrieveGames,
    addGame,
    updateGameDetails,
    markGameAsPlayed
}