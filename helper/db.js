const mongoose = require('mongoose');
module.exports = () => {

    mongoose.connect(process.env.DB, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify:false
    });
    const db = mongoose.connection;
    db.once('open', () => {
        console.log("Mongo DB is Connected");
    });
    db.on('error', (err) => {
        console.log(err);
    });

}