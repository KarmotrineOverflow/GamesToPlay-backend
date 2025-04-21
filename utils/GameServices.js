const sqlServices = require('../services/MySQLServices');
const templates = require('../templates/ObjectTemplates')

function retrieveGames(tableName) {

    let result = sqlServices.fetchAllItems(tableName)
    return result
}

function addGame(gameDetails, tableName) {

    let newGame = new templates.Game(gameDetails.title, gameDetails.gameDescription, gameDetails.thoughts, gameDetails.boxArt)

    let result = sqlServices.addItem(newGame, tableName)
    return result
}  

module.exports = {

    retrieveGames,
    addGame
}