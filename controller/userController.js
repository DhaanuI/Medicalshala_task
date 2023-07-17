const moment = require("moment");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { validationResult } = require('express-validator');
const { UserModel } = require("../model/UserModel");
require("dotenv").config();
var fast2sms = require('fast2sms');
var options = { API_KEY: process.env.API_KEY };
fast2sms.init(options)


const userRegister = async (req, res) => {
    const errors = validationResult(req);

    // email validation using Express-Validation
    if (!errors.isEmpty()) {
        logger.error('Email is INVALID');
        return res.status(400).json({ "message": "Email is INVALID" });
    }

    const { name, email, password } = req.body

    const userFound = await UserModel.findOne({ email })
    if (userFound) {
        logger.warn('Already user registered');
        res.status(409).send({ "message": "Already user registered" })
    }
    else {
        try {

            let dateFormat = moment().format('D-MM-YYYY');
            bcrypt.hash(password, 5, async function (err, hash) {
                const data = new UserModel({ name, email, password: hash, registeredDate: dateFormat })
                await data.save()

                logger.info('User added');
                res.status(201).send({ "message": "user Registered" })

            });
        }
        catch (err) {
            logger.error('Error occurred during user post', { error: err });
            res.status(400).send({ "ERROR": err })
        }
    }
}

// logging in via email
const userLogin = async (req, res) => {
    const errors = validationResult(req);

    // email validation using Express-Validation
    if (!errors.isEmpty()) {
        logger.error('Email is INVALID');
        return res.status(400).json({ "message": "Email is INVALID" });
    }

    const { email, password } = req.body
    let data = await UserModel.findOne({ email })
    if (!data) {
        logger.warn('No user found');
        return res.send({ "message": "No user found" })
    }
    try {
        bcrypt.compare(password, data.password, function (err, result) {
            if (result) {
                var token = jwt.sign({ userID: data._id }, process.env.key, { expiresIn: 3 * 60 * 60 });
                logger.info('Validation done during LOGIN');
                res.status(201).send({
                    "message": "Validation done",
                    "token": token,
                    "name": data.name,
                    "id": data._id
                })
            }
            else {
                logger.warn('Login failed');
                res.status(401).send({ "message": "INVALID credentials" })
            }
        });
    }
    catch (err) {
        logger.error('Login failed');
        res.status(400).send({ "ERROR": err })
    }
}

// checks mobile and triggers an otp
const userLoginOTP = async (req, res) => {
    const errors = validationResult(req);

    // email validation using Express-Validation
    if (!errors.isEmpty()) {
        logger.error('PhoneNumber is INVALID');
        return res.status(400).json({ "message": "PhoneNumber is INVALID" });
    }

    const { phone } = req.body
    let data = await UserModel.findOne({ phone })
    if (!data) {
        logger.warn('No user found');
        return res.send({ "message": "No user found" })
    }
    try {

        const otp = Math.floor(1000 + Math.random() * 9000); 
        const otpData = await fast2sms.send({ message: `Your OTP : ${otp}, Please enter this OTP to complete your Login`, to: phone });
        data.phoneOtp = otp.toString();

        res.send({ "message": "OTP is sent to the registered Mobile" })

    }
    catch (err) {
        logger.error('Login failed');
        res.status(400).send({ "ERROR": err })
    }
}


//verify OTP
const verifyOTP = async (req, res) => {
    const { phone, otp } = req.body
    let data = await UserModel.findOne({ phone })
    if (!data) {
        logger.warn('No user found');
        return res.send({ "message": "No user found" })
    }
    try {
        if (data.phoneOtp !== otp) {
            return res.send({ "message": "Invalid/Incorrect OTP" })
        }
        else {
            var token = jwt.sign({ userID: data._id }, process.env.key, { expiresIn: 3 * 60 * 60 });
            data.phoneOtp = ""
            logger.info('Validation done during LOGIN');
            res.status(201).send({
                "message": "Validation done",
                "token": token,
                "name": data.name,
                "id": data._id
            })
        }

    }
    catch (err) {
        data.phoneOtp = ""
        logger.error('Login failed');
        res.status(400).send({ "ERROR": err })
    }
}


const userPatch = async (req, res) => {
    const ID = req.params.id;
    const payload = req.body;
    try {
        if (ID === payload.userID) {
            await UserModel.findByIdAndUpdate({ _id: ID }, payload)
            logger.info('Updated user info');
            res.send({ "message": "Database modified" })
        }
        else {
            logger.warn('Not authorized');
            res.send({ "message": "Not authorized" })
        }
    }
    catch (err) {
        logger.error('Updating user info failed');
        res.status(400).send({ "message": "error" })
    }
}


const userDelete = async (req, res) => {
    const ID = req.params.id;
    try {
        if (ID === req.body.userID) {
            await UserModel.findByIdAndDelete({ _id: ID })
            logger.info('deleted user info');
            res.send({ "message": "Database modified" })
        }
        else {
            logger.warn('Not authorized');
            res.send({ "message": "Not authorized" })
        }
    }
    catch (err) {
        logger.error('DELETE failed');
        res.status(400).send({ "message": "error" })
    }
}


const userGet = async (req, res) => {
    // page to be passed by user
    // .skip((page-1)*2).limit(3)   ---- > Pagination
    try {
        let data;
        const id = req.query.id;
        const page = req.query.page

        // limit per page is 3 users
        if (id && page) {
            data = await UserModel.find({ _id: id }).skip((page - 1) * 2).limit(3);
        } else if (page) {
            data = await UserModel.find().skip((page - 1) * 2).limit(3);
        } else if (id) {
            data = await UserModel.find({ _id: id });
        }
        else data = await UserModel.find();


        res.status(200).send({ "users": data })
    }
    catch (err) {
        logger.error('Unable to fetch users');
        res.status(400).send({ "ERROR": err })
    }
}


module.exports = {
    userRegister, userLogin, userLoginOTP, verifyOTP, userPatch, userDelete, userGet
}