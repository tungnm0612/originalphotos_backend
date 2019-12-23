const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema(
    {
        password: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        username: {
            type: String,
            required: true,
            unique: true,
        },
        fullname: {
            type: String,
            required: true
        },
        phone: {
            type: String,
            required: true
        },
        disabled: false
    },
    {
        timestamps: true
    }   
);

module.exports = mongoose.model('User', UserSchema);

