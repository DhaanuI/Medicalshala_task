const express = require("express");
require("dotenv").config();

const { authenticate } = require("../middleware/authenticate.middleware")
const { appointmentAdd, appointmentGet, appointmentPatch, appointmentDelete, appointmentbyUsers, appointmentbyDoc } = require("../controller/userController");

const appointmentRoute = express.Router();
appointmentRoute.use(express.json());
appointmentRoute.use(authenticate);


appointmentRoute.get("/", appointmentGet)


appointmentRoute.get("/docapp/:id", appointmentbyDoc)


appointmentRoute.get("/patapp/:id", appointmentbyUsers)


appointmentRoute.post("/add", appointmentAdd)


appointmentRoute.patch("/update/:id", appointmentPatch)


appointmentRoute.delete("/delete/:id", appointmentDelete)


module.exports = {
    appointmentRoute
}