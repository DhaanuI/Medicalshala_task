const express = require("express");
const { userRegister, userLogin, userPatch, userDelete, userGet, userLoginOTP, verifyOTP } = require("../controllers/userController");
const userRoute = express.Router();
userRoute.use(express.json());
const { body } = require('express-validator');
const { authenticate } = require("../middleware/authenticate.middleware");

const isValidMobileNumber = (value) => {
    const phoneRegex = /^\d{10}$/; // Customize the regular expression as per your requirement
    return phoneRegex.test(value);
};

// to register user and then hashing password using Bcrypt
// Validation of email 
userRoute.post("/register", body('email').isEmail().normalizeEmail(), userRegister)


// to let user login and then create and send token as response
userRoute.post("/login", body('email').isEmail().normalizeEmail(), userLogin)


// to let user login and then create and send token as response
userRoute.post("/otp", body('phoneNumber').custom(isValidMobileNumber).withMessage('Invalid phone number'), userLoginOTP)


userRoute.post("/verifyotp", verifyOTP)


// get particular user or all users
userRoute.get("/", userGet)


userRoute.use(authenticate)


// update particular user 
userRoute.patch("/update/:id", userPatch)


// delete particular user 
userRoute.delete("/delete/:id", userDelete)


module.exports = {
    userRoute
}