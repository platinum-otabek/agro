const mongoose = require('mongoose');

const expenseSchema = mongoose.Schema({
    reason: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true
    },
    reasonType:{
        type:String,
        required:true
    },
    createdAt:{
        type:Date
    },
    name:{
        type:String,
        required:true
    },
    hudud:{
        type:String,
        required:true
    }
    
});

module.exports = mongoose.model('expense',expenseSchema);