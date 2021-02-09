const mongoose = require('mongoose');


const storageSchema = mongoose.Schema({
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
        date:{type:Date,
        }
    }],
    createdAt:{
        type:Date,
    }
});

module.exports = mongoose.model('storage',storageSchema);