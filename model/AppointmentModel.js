const mongoose = require("mongoose")

const { DoctorModel } = require("./DoctorModel");
const { UserModel } = require("./UserModel");


const appointmentSchema = mongoose.Schema({
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: DoctorModel },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: UserModel },
    date: { type: Date, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true }
});


const AppointmentModel = mongoose.model("appointment", appointmentSchema)

module.exports = {
    AppointmentModel
}