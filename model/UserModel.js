const mongoose = require("mongoose")


const userSchema = mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, unique: true },
    password: { type: String, },
    phoneNumber: { type: Number },
    phoneOtp: { type: String },
    registeredDate: { type: String },            // note down the date registered
})

const UserModel = mongoose.model("user", userSchema)

module.exports = {
    UserModel
}