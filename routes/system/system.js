const express = require('express');
const router = express.Router();
const passport = require('passport');

/* GET Login page. */
router.get('/', (req, res, next)=> {
  res.render('login', { title: 'Express' });
});
/* GET Login page. */
router.get('/login', (req, res, next)=> {
  res.render('login', { title: 'Login' });
});

/* Post Login and authenticate page. */
router.post('/login', (req, res, next)=> {
  const {name,pass} = req.body;
  
  //checking
  req.checkBody('name','Iltimos ismingizni kiriting!!!').notEmpty();
  req.checkBody('pass','Iltimos parolingizni kiriting!!!').notEmpty();
  const errors = req.validationErrors();
  if(errors){
    res.render('login',{errors:errors});
  }else{
      passport.authenticate('local',{
        successRedirect:'/commerce/show',
        failureRedirect:'/',
        failureFlash:true
      })(req,res,next);
  }
});
/* GET system . */
router.get('/system', function(req, res, next) {
  res.render('system/system',{title:'Qarzdorlik qo`shish'}); 
});
 

/* GET Logout page. */
router.get('/logout', (req, res, next)=> {
  req.logout();
  res.redirect('/');
});
module.exports = router;
