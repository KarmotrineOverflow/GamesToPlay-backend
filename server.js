require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { Builder, By, Browser } = require('selenium-webdriver')
const gameServices = require('./utils/GameServices')

const app = express()

const backendPort = process.env.BACKEND_PORT

app.use(express.json());
app.use(
    cors({
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
        origin: "http://localhost:5173",
        credentials: true
    })
)


/* CONVERT THIS ENDPOINT METHOD TO GET AND RETRIEVE GAME TITLE FROM QUERY PARAMETER */
app.get('/game/box-art', async (req, res) => {

    let requestParams = req.query;
    let gameTitle = requestParams.game_title

    let titleParts = gameTitle.split(' ');
    let formattedGameTitle = titleParts.join('+');
    let imageUrl = "";

    let driver = await new Builder().forBrowser(Browser.CHROME).build();

    try {

        await driver.get(`https://bing.com/images/search?q=${formattedGameTitle}`);
        let rowElement = await driver.findElement(By.className("dgControl_list"))
            /* .then(response => response[0].findElement(By.className('img_cont')))
            .then(response => response.findElement(By.css("img")))
            .then(response => response.getAttribute("src"))
            .then(imgUrl => imageUrl = imageUrl)
            .catch(err => console.log(err)) */ // For some reason, the shorthand function for handling promises don't work here :/
        let imageTile = await rowElement.findElement(By.className("img_cont"))
        let imageTag = await imageTile.findElement(By.css("img"))
        let imageSrc = await imageTag.getAttribute("src")

        imageUrl = imageSrc
    } finally {

        driver.close();
        res.send({"image_url": imageUrl})        
    }
})

// Endpoint for caching game box art URLs
app.put('/game/box-art/update', async (req, res) => {

    try {

        // To update the table item, I need to get the table type and the game id
        const requestBody = req.body
        const queryParams = req.query

        var tableName = queryParams.table_name
        var gameId = queryParams.game_id
        var boxArtUrl = requestBody.box_art_url

        var gameDetails = {
            id: gameId,
            box_art: boxArtUrl
        }

        let results = await gameServices.updateGameDetails(tableName, gameDetails)

        res.send({result: results})
    } catch (e) {

        driver.close();
        res.send({"image_url": imageUrl})  
    }
})


// Endpoint for retrieving game details from server
app.get('/game/:tableType', async (req, res) => {
    try {

        const queryParams = req.params
        const tableName = queryParams.tableType
        
        let results = await gameServices.retrieveGames(tableName)

        res.send({"games": results})
    } catch (e) {

        res.status(502)
        res.send({"error": e.message})
    }
})

// Endpoint for adding new game entries
app.post('/game/:gameType/add', (req, res) => {    
    try {

        const requestBody = req.body
        const requestParameters = req.params
        
        var gameDetails = requestBody.game_details
        var tableName = requestParameters.gameType

        let result = gameServices.addGame(tableName, gameDetails)

        res.send({"result": result})
    } catch (e) {

        res.status(502)
        res.send({"error": e.message})
    }
})


// Endpoint for updating an existing game's details
app.put('/game/:gameType/update', async (req, res) => {

    try {

        const requestBody = req.body
        const requestParams = req.params

        var tableName = requestParams.gameType
        var gameDetails = requestBody.game_details

        console.log(gameDetails)

        var response = gameServices.updateGameDetails(tableName, gameDetails)

        res.send({"result": response})
    } catch (e) {

        res.status(502)
        res.send({"error": e.message})
    }
})

// Endpoint for deleting a game entry
app.delete('/game/:gameType/delete', (req, res) => {

    try {
        const queryParams = req.query
        const requestParams = req.params

        var tableName = requestParams.gameType
        var gameId = queryParams.game_id

        var response = gameServices.deleteGame(tableName, gameId)

        res.send({"result": response})
    } catch (e) {

        res.status(502)
        res.send({"error": e.message})
    }
})

// Endpoint for marking 'to play' game as played and moving it over to PlayedGames table
app.put('/game/mark-as-played', async (req, res) => {

    try {

        // Get game details
        const requestBody = req.body
        const gameDetails = requestBody.game_details    

        // Delete game details from 'To Play' table
        // Add game details to 'Played Games' table
        let response = gameServices.markGameAsPlayed(gameDetails)
    } catch (e) {

        res.status(502)
        res.send({error: e.message})
    }
})


app.listen(backendPort, (err) => {

    if (err) {

        console.log("Error launching server: " + err.message)
    } else {

        console.log(`Server listening at http://localhost:${backendPort}`);
    }
})