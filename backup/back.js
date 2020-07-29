const Branch = require('../models/Branch');
const User = require('../models/User');
const Items = require('../models/Items');
const Debt = require('../models/Debt');
const Commerce = require('../models/Commerce');
const Orders = require('../models/Orders');
const fs = require('fs');

var backup = require('mongodb-restore'); // use require('mongodb-backup') instead

/*
 * use
 */
module.exports = ()=>{
    backup({
        uri: process.env.DB,  // mongodb://<dbuser>:<dbpassword>@<dbdomain>.mongolab.com:<dbport>/<dbdatabase>
        root: __dirname, // write files into this dir
        parser:'JSON'     
    });
}

