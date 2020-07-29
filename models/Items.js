const mongoose = require('mongoose');

const itemSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique:true
    },
    unit: {
        type: String,
        required: true
    },
    price:{
        type: Number,
        required: true
    }
    
});

module.exports = mongoose.model('item',itemSchema);