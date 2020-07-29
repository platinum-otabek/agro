const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: {
        type: String, lowercase:true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    number: {
        type: String,
    },
    hudud: {
        type: String,
    },
    status:{
        type: String,
        required: true
    }
});

module.exports = mongoose.model('user',userSchema);