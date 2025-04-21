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
        methods: ["*"],
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
app.put('/game/box-art/update', (req, res) => {

    
})


// Endpoint for retrieving game details from server
app.get('/game/:tableType', async (req, res) => {

    const queryParams = req.params
    const tableName = queryParams.tableType
    
    let results = await gameServices.retrieveGames(tableName)

    res.send({"games": results})
})

// Endpoint for adding new game entries
app.post('/game/:gameType/add', (req, res) => {    

    //TODO: Create endpoint to allow adding of games to specified table
    
    const requestBody = req.body
    const requestParameters = req.params

    let result = gameServices.addGame(gameDetails, tableName)

    res.send({"result": result})
})


// Endpoint for updating an existing game's details
app.put('/game/:gameType/update', (req, res) => {

    
})

// Endpoint for deleting a game entry
app.delete('/game/:gameType/delete', (req, res) => {

    
})

// Endpoint for marking 'to play' game as played and moving it over to PlayedGames table
app.put('/game/mark-as-played', (req, res) => {

    
})


app.listen(backendPort, (err) => {

    if (err) {

        console.log("Error launching server: " + err.message)
    } else {

        console.log(`Server listening at http://localhost:${backendPort}`);
    }
})