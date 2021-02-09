const express = require('express');

const router = express.Router();

const Branch = require('../../models/Branch');
const User = require('../../models/User');
const {eA,eK,eS,} = require('../../middleware/middleware');
const bcrypt = require('bcrypt');

//verifyToken 
const verifyToken = require('../../middleware/verifyToken');
const { token } = require('morgan');

/* GET allusers . */
// user/all
router.get('/all',eS, (req, res, next)=> { 
  User.find({},(err,allUsers)=>{
    res.render('user/all',{allusers:allUsers});
  })
});
/* GET create_user page. */
router.get('/create',eS, (req, res, next)=> {
  Branch.find({},(err,branchs)=>{
    res.render('user/create', { title: 'Create user',branchs,token:global.token });
  })
});

/* Post create page. */
router.post('/create',eS,verifyToken, (req, res, next)=> {
  const {name,pass,status,} = req.body;
  number = req.body.number || '';
  hudud = req.body.hudud || '';
  
  //checking
  req.checkBody('name','Iltimos ismingizni kiriting!!!').notEmpty();
  req.checkBody('pass','Iltimos parolingizni kiriting!!!').notEmpty();
  if(req.user.status == 'super'){
    req.checkBody('number','Iltimos raqamingizni kiriting!!!').notEmpty();
    req.checkBody('hudud','Iltimos hududingizni kiriting!!!').notEmpty();
    req.checkBody('status','Iltimos statusni belgilang kiriting!!!').notEmpty();
  }
  else if(req.user.status == 'king'){
    req.checkBody('status','Iltimos statusni belgilang kiriting!!!').notEmpty();
  }
  const errors = req.validationErrors();
  if(errors){
    res.render('login',{errors:errors});
  }else{
    bcrypt.hash(pass,10).then((hash)=>{
      const newUser = new User({
        name,
        password:hash,
        number,
        hudud,
        status
      })
      newUser.save((err)=>{
        if(err)
          {
            req.flash('danger','Xodimni kiritishda xatolik mavjud');
            res.redirect('/user/create');
          }
        else{
          if(req.user.status == 'super'){
              Branch.updateOne({name:hudud},{branch_admin:name},(err)=>{
                req.flash('info','Xodim muvaffaqiyatli qo`shildi ushbu filial xodimi o`zgartirildi');
                res.redirect('/user/create');
              })
          }
          else{
            req.flash('info','Super or king muvaffaqiyatli qo`shildi');
                res.redirect('/user/all');
          }
        }
      })
    })
  }
});

/* GET delete user. */
// user/delete/id
router.get('/delete/:id',eS, (req, res, next)=> {
  User.deleteOne({_id:req.params.id},(err)=>{
    if(err)
      console.log(err);
    else{
      req.flash('info','Xodim o`chirildi');
      res.redirect('/user/all')
    }
  })
});




module.exports = router;
