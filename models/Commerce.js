const mongoose = require('mongoose');
const moment = require('moment-timezone');
const utc = new Date();
utc.setHours( utc.getHours() + 5);
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
        required:true,
        default:0
    },
    discount:{
        type: Number,
        required: true,
        default:0
    },
    transferMoney:{
        type:Number,
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
        default:utc
    }
});

module.exports = mongoose.model('commerce',commerceSchema);
