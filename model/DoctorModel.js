const mongoose = require("mongoose")

const doctorSchema = mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    registeredDate: { type: String },            // note down the date registered
    specialization: { type: String, enum: ["general", "heart", "kidney"], default: "general" }
})

const DoctorModel = mongoose.model("doctor", doctorSchema)

module.exports = {
    DoctorModel
}