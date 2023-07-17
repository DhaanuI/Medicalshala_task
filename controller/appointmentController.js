const { AppointmentModel } = require("../model/AppointmentModel");


const appointmentAdd = async (req, res) => {
    const { doctorId, date, startTime, endTime, userId } = req.body;
    try {
        const isSlotBooked = await AppointmentModel.exists({
            doctorId,
            date,
            $or: [
                { startTime: { $lt: endTime, $gte: startTime } },
                { endTime: { $gt: startTime, $lte: endTime } }
            ]
        });

        if (isSlotBooked) {
            return res.status(409).send({ "message": 'Time slot not available. Please choose a different time.' });
        }

        const appointment = new AppointmentModel({
            doctorId,
            userId,
            date,
            startTime,
            endTime
        });

        await appointment.save();
        res.send({ "message": 'Appointment booked successfully' });
    } catch (error) {
        console.log(error)
        res.status(500).send({ "message": 'An error occurred while booking the appointment' });
    }
}


const appointmentGet = async (req, res) => {
    try {
        let data = await AppointmentModel.find().populate("userId doctorId")
        res.status(200).send({ "Appointments": data })
    }
    catch (err) {
        res.status(404).send({ "ERROR": err })
    }
}


const appointmentPatch = async (req, res) => {
    const ID = req.params.id;
    const payload = req.body;
    try {
        await AppointmentModel.findByIdAndUpdate({ _id: ID }, payload)
        res.send({ "message": "Appointment modified" })
    }
    catch (err) {
        console.log(err)
        res.send({ "message": "error" })
    }
}


const appointmentDelete = async (req, res) => {
    const ID = req.params.id;
    try {
        await AppointmentModel.findByIdAndDelete({ _id: ID })
        res.send({ "message": "Particular Appointment has been deleted" })
    }
    catch (err) {
        console.log(err)
        res.send({ "message": "error" })
    }
}


const appointmentbyUsers = async (req, res) => {
    const ID = req.params.id;
    try {
        let data = await AppointmentModel.find({ userId: ID }).populate("userId patientId")
        res.status(200).send({ "Appointments": data })
    }
    catch (err) {
        res.status(500).send({ "ERROR": err })
    }
}


const appointmentbyDoc = async (req, res) => {
    const ID = req.params.id;
    try {
        let data = await AppointmentModel.find({ doctorId: ID }).populate("userId patientId")
        res.status(200).send({ "Appointments": data })
    }
    catch (err) {
        res.status(500).send({ "ERROR": err })
    }
}


module.exports = {
    appointmentAdd, appointmentGet, appointmentPatch, appointmentDelete, appointmentbyUsers, appointmentbyDoc
}