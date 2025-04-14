require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Builder, By, Browser } = require('selenium-webdriver')
const app = express()

const backendPort = process.env.LOCAL_BACKEND_PORT

app.use(express.json());
app.use(
    cors({
        methods: ["POST"],
        origin: "http://localhost:5173",
        credentials: true
    })
)

/* CONVERT THIS ENDPOINT METHOD TO GET AND RETRIEVE GAME TITLE FROM QUERY PARAMETER */
app.post('/game/box-art', async (req, res) => {

    let requestBody = req.body;
    let gameTitle = requestBody.game_title

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

app.listen(backendPort, (err) => {

    if (err) {

        console.log("Error launching server: " + err.message)
    } else {

        console.log(`Server listening at http://localhost:${backendPort}`);
    }
})