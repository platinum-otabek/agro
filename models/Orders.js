const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    chat_id: {
        type: String,
        required: true
    },
    name:{
        type: String,
    },
    number:{
        type: String,
    },
    order_list:{
        type:Array
    },
    filial:{
        type:String
    },
    step:{
        type:String
    },
    finish:{
        type: Boolean,
        default:0
    }
});

module.exports = mongoose.model('order',orderSchema);