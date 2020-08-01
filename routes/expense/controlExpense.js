const express = require('express');
const router = express.Router();
const passport = require('passport');
const {
  eA,
  eS,
  eK,
  eAdmin
} = require('../../middleware/middleware');

//model
const Expense = require('../../models/Expense');

/* GET create page. */
router.get('/create',eA, (req, res, next)=> {
    res.render('expense/create',{token:global.token});
});

/* POST create page. */
router.post('/create',eA, (req, res, next)=> {
    const {reason,price,reasontype} = req.body;
    //get time 
    const utc = new Date();
    utc.setHours( utc.getHours() + 5);
    //******** */
    const newExpense = new Expense({
      reason,
      price,
      'reasonType':reasontype,
      'name':req.user.name,
      'hudud':req.user.hudud,
      'createdAt':utc
    });
    newExpense.save((err,data)=>{
        if(err){
          req.flash('danger','Kiritilmadi');
          res.redirect('/expense/create');
        }
        else{
          req.flash('info','Muvaffaqiyatli kiritildi');
          res.redirect('/expense/show');
        }
    });
});

/* GET all page. */
router.get('/all',eA, async(req, res, next)=> {
  res.render('expense/all',{token:global.token});
});

/* GET show page. */
router.get('/show',eA, async(req, res, next)=> {
  res.render('expense/show',{title:'Xarajatlarni ko`rish',token:global.token});
});

/* GET show page. */
router.post('/show',eA, async(req, res, next)=> {
    let beginTime = new Date(req.body.begin); //kiriitilgan begin vaqtni boslanish
    let finishTime = new Date(req.body.finish);//kiriitilgan finish vaqtni boslanish
    let hudud = req.user.hudud || req.body.hudud;//hudud
   
    await Expense.find({'createdAt':{$gte:beginTime,$lte:finishTime},'hudud':hudud},async(err,data)=>{
      if(err)
        {
          req.flash('danger','Xatolik mavjud');
          res.redirect('/expense/show');
        }
      else{           
          res.render('expense/all',{expenses:data});
      }
    })

});

module.exports = router;