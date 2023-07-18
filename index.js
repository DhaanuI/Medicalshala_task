const express = require("express")
const mongoose = require('mongoose');

const app = express()
app.use(express.json())
require("dotenv").config()

const { connection } = require("./config/db")
const { userRoute } = require("./route/userRoute")
const { doctorRoute } = require("./route/docRoute")
const { logRequestDetails } = require("./middleware/logger.middleware")


app.get("/", (req, res) => {
    res.send("Welcome to Backend")
})


// Apply the middleware to all routes
app.use(logRequestDetails);


app.use("/users", userRoute)
app.use("/doctors", doctorRoute)



const connectWithRetry = () => {
    connection
        .then(() => {
            console.log('Connected to MongoDB');
            console.log(`Listening to server at port ${process.env.port}`)
        })
        .catch((error) => {
            console.error('Failed to connect to MongoDB:', error);
            console.log('Retrying connection in 5 seconds...');
            setTimeout(connectWithRetry, 5000); // Attempt to reconnect after a delay
        });
};


mongoose.connection.on('disconnected', () => {
    console.log('Lost MongoDB connection');
    console.log('Retrying connection...');
    connectWithRetry();
});


app.listen(process.env.port, async () => {
    // Initial connection attempt
    await connectWithRetry();
})