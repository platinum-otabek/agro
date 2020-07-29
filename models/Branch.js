const mongoose = require('mongoose');

const branchSchema = mongoose.Schema({
    name: {
        type: String, lowercase:true,
        required: true,
        unique:true,
        
    },
    branch_admin: {
        type: String, lowercase:true,
    },
    sklad:[{
       name:{
           type:String, lowercase:true,
           unique:false
       },
       amount:Number,
       price:Number
    }],
    desc:{
        type:String,
        required:true
    }
    
});

module.exports = mongoose.model('branch',branchSchema);