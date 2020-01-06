const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ImageSchema = new Schema(
    {
        idUser:{
            type: String,
            required: true
        },
        nameImage:{
            type: String,
            require: true
        },
        hashImage: {
            type: String,
            required: true,
            unique: true
        },
        transactionHash: {
            type: String,
            required: true,
            unique: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('Image', ImageSchema);