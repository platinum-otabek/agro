const mongoose = require('mongoose');

const moment = require('moment-timezone');
const dateUzbekistan = moment.tz(Date.now(), "Asia/Tashkent");

const utc = new Date();
utc.setHours( utc.getHours() + 5);

const debtSchema = mongoose.Schema({
    passport_id: {
        type: String, lowercase:true,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    number: {
        type: String,
        required:true
    },
    allsum: {
        type: Number,
        required:true
    },
    debtsum: {
        type: Number,
        required:true
    },
    items:{
        type: String,
        required: true,
        default:0
    },
    hudud:{
        type:String,
        required:true,
    },
    history:[{
        sum:{type:Number},
        taken_name:{type:String},
        date:{type:Date,
            default: utc}
    }],
    createdAt:{
        type:Date,
        default: utc
    }
});

module.exports = mongoose.model('debt',debtSchema);