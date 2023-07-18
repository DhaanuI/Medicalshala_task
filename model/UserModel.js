const mongoose = require("mongoose")


const userSchema = mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    phoneNumber: { type: Number, required: true},
    registeredDate: { type: String },            // note down the date registered
})

const UserModel = mongoose.model("user", userSchema)

module.exports = {
    UserModel
}