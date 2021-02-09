const mongoose = require('mongoose');

const productgraph = mongoose.Schema({
    name:{
        type: String, lowercase:true,
        required: true,
    },
    amount:{
        type:Number,
        required: true
    },
    hudud:{
        type:String,
        required:true
    },
    createdAt:{
        type:Date,
        required:true
    }
})


module.exports = mongoose.model('productgraph',productgraph);