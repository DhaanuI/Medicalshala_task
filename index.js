const express = require("express")
const app = express()
app.use(express.json())
require("dotenv").config()

const { connection } = require("./config/db")


app.get("/", (req, res) => {
    res.send("Welcome to Backend")
})




app.listen(process.env.port, async () => {
    try {
        await connection;
        console.log("DB is connected")
    }
    catch (err) {
        console.log("DB is not connected", err)
    }

    console.log(`Listening to server at port ${process.env.port}`)
})