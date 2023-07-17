const express = require("express");
const { docRegister, docLogin, docPatch, docDelete, docGet } = require("../controller/docController");

const doctorRoute = express.Router();
doctorRoute.use(express.json());
const { body } = require('express-validator');

const { authenticate } = require("../middleware/authenticate.middleware")


// to register doctor and then hashing password using Bcrypt
doctorRoute.post("/register", body('email').isEmail().normalizeEmail(), docRegister)


// to let doctor login and then create and send token as response
doctorRoute.post("/login", body('email').isEmail().normalizeEmail(), docLogin)


// get particular user or all users
doctorRoute.get("/", docGet)


doctorRoute.use(authenticate)


doctorRoute.patch("/update/:id", docPatch)


doctorRoute.delete("/delete/:id", docDelete)


module.exports = {
    doctorRoute
}