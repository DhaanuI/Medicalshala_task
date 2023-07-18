const moment = require("moment");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { validationResult } = require('express-validator');
const { DoctorModel } = require("../model/DoctorModel");
require("dotenv").config();

const { logger } = require("../middleware/logger.middleware")


const docRegister = async (req, res) => {
    const errors = validationResult(req);

    // email validation using Express-Validation
    if (!errors.isEmpty()) {
        logger.error('Email is INVALID');
        return res.status(400).json({ "message": "Email is INVALID" });
    }

    const { name, email, password, specialization } = req.body
    const doctorFound = await DoctorModel.findOne({ email })
    if (doctorFound) {
        res.status(409).send({ "message": "Already doctor registered" })
    }
    else {
        try {
            let dateFormat = moment().format('D-MM-YYYY');

            bcrypt.hash(password, 5, async function (err, hash) {
                const data = new DoctorModel({ name, email, password: hash, registeredDate: dateFormat, specialization })
                await data.save()
                res.status(201).send({ "message": "Doctor Registered" })
            });
        }
        catch (err) {
            res.status(500).send({ "ERROR": err })
        }
    }
}


const docLogin = async (req, res) => {

    const errors = validationResult(req);

    // email validation using Express-Validation
    if (!errors.isEmpty()) {
        logger.error('Email is INVALID');
        return res.status(400).json({ "message": "Email is INVALID" });
    }


    const { email, password } = req.body
    let data = await DoctorModel.findOne({ email })
    if (!data) {
        return res.send({ "message": "No user found" })
    }
    try {
        bcrypt.compare(password, data.password, function (err, result) {
            if (result) {
                var token = jwt.sign({ doctorID: data._id }, process.env.key);

                res.status(201).send({
                    "message": "Validation done",
                    "token": token,
                    "name": data.name,
                    "id": data._id
                })
            }
            else {
                res.status(401).send({ "message": "INVALID credentials" })
            }
        });
    }
    catch (err) {
        res.status(500).send({ "ERROR": err })
    }
}


const docPatch = async (req, res) => {
    const ID = req.params.id;
    const payload = req.body;
    try {
        if (ID === payload.userID) {
            await DoctorModel.findByIdAndUpdate({ _id: ID }, payload)
            res.send({ "message": "Database modified" })
        }
        else {
            logger.warn('Not authorized');
            res.send({ "message": "Not authorized" })
        }
    }
    catch (err) {
        console.log(err)
        res.send({ "message": "error" })
    }
}


const docDelete = async (req, res) => {
    const ID = req.params.id;

    try {
        if (ID === req.body.userID) {
            await DoctorModel.findByIdAndDelete({ _id: ID })
            res.send({ "message": "Particular data has been deleted" })
        }
        else {
            logger.warn('Not authorized');
            res.send({ "message": "Not authorized" })
        }
    }
    catch (err) {
        console.log(err)
        res.send({ "message": "error" })
    }
}


const docGet = async (req, res) => {
    // page to be passed by user
    // .skip((page-1)*2).limit(3)   ---- > Pagination
    try {
        let data;
        const id = req.query.id;
        const page = req.query.page

        // limit per page is 3 users
        if (id && page) {
            data = await DoctorModel.find({ _id: id }).skip((page - 1) * 2).limit(3);
        } else if (page) {
            data = await DoctorModel.find().skip((page - 1) * 2).limit(3);
        } else if (id) {
            data = await DoctorModel.find({ _id: id });
        }
        else data = await DoctorModel.find();


        res.status(200).send({ "Doctors": data })
    }
    catch (err) {
        logger.error('Unable to fetch users');
        res.status(400).send({ "ERROR": err })
    }
}


module.exports = {
    docRegister, docLogin, docPatch, docDelete, docGet
}