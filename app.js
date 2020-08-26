const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const flash = require('connect-flash');
const expressValidator = require('express-validator');
const session = require('express-session');
const dotenv = require('dotenv').config();
const db = require('./helper/db')();
const tg = require('./telegram/telegrafbot')();
const passport = require('passport');

//backup
//routes
const userRouter = require('./routes/user/controleUser');
const systemRouter = require('./routes/system/system');
const itemRouter = require('./routes/item/controlItem');
const branchRouter = require('./routes/branch/controlBranch');
const commerceRouter = require('./routes/commerce/controlCommerce');
const branchControlRouter = require('./routes/branch/controlBranchItem'); // filialdagi mahsulot
const debtRouter = require('./routes/debt/controlDebt');
const storageRouter = require('./routes/storage/controlStorage');
const expenseRouter = require('./routes/expense/controlExpense');
const returnRouter = require('./routes/return/controlReturn');
const productGraphRouter = require('./routes/productgraph/controlProductgraph');
const app = express();


// view engine setup
app.set('views',[ path.join(__dirname, 'views'),
                path.join(__dirname, 'views/login/')]);
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//session
//express session
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true,
  cookie:{maxAge:24*60*1000}
}));

//flash
app.use(flash());
app.use((req,res,next)=>{
  res.locals.messages = require('express-messages')(req,res);
  next();
});

//express validator
app.use(expressValidator({
  errorFormatter: (param,msg,value) => {
      let namespace = param.split('.'),
          root = namespace.shift(),
          formParam = root;

      while(namespace.length){
          formParam += '[' + namespace.shift() +']';
      }
      return {
          param:formParam,
          msg:msg,
          value:value
      }
  }
}))

//passport init
require('./config/passport')(passport);
//passport middleware
app.use(passport.initialize());
app.use(passport.session());

//user global
app.get('*',(req,res,next)=>{
  res.locals.user = req.user || null;
  next();
});



//
app.use('/user', userRouter);
app.use('/', systemRouter);
app.use('/item', itemRouter);
app.use('/branch', branchRouter);
app.use('/branch/item', branchControlRouter);
app.use('/commerce', commerceRouter);
app.use('/debt', debtRouter);
app.use('/storage', storageRouter);
app.use('/expense', expenseRouter);
app.use('/return', returnRouter);
app.use('/productgraph', productGraphRouter);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});
 
// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  // res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
