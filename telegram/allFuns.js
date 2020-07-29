let items,updatedAt=new Date();
const Item = require('../models/Items');

const geteverydate = ()=>{
   
        updatedAt = new Date();
        Item.find({},(err,data)=>{
            items = data;
        });
    
    return items
}; 
    module.exports.geteverydate =geteverydate;
