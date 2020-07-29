const mongoose = require('mongoose');
const moment = require('moment-timezone');
const dateUzbekistan = moment.tz(Date.now(), "Asia/Tashkent");

const commerceSchema = mongoose.Schema({
    items: {
        type: String, lowercase:true,
        required: true
    },
    allSum: {
        type: Number,
        required: true
    },
    naqd: {
        type: Number,
        required:true
    },
    terminal: {
        type: Number,
        required:true
    },
    discount:{
        type: Number,
        required: true,
        default:0
    },
    hudud:{
        type:String,
    },
    debt:{
        type:String
    },
    createdAt:{
        type:Date,
        default: dateUzbekistan
    }
});

module.exports = mongoose.model('commerce',commerceSchema);