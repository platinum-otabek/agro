const express = require('express');

const router = express.Router();

const Branch = require('../../models/Branch');
const Debt = require('../../models/Debt');
const User = require('../../models/User');
const {eA,eK,eS,} = require('../../middleware/middleware');

// verify token
const verifyToken = require('../../middleware/verifyToken');


/* GET allusers . */
// user/all
router.get('/all',eA, (req, res, next)=> { 
    Debt.find({},(err,debts)=>{
        res.render('debt/all',{title:'Hamma qarzdorlik',debts:debts});
    })
  });

/* GET create debt . */
// user/all
router.get('/create',eA, async(req, res, next)=> {
    let branches = [];
        if(req.user.status == 'super'){
           branches =  await Branch.find({});
           res.render('debt/create',{title:'Qarzdorlik qo`shish',branches:branches,token:global.token});
        } 
        else{
            branches = [];
            res.render('debt/create',{title:'Qarzdorlik qo`shish',branches:branches,token:global.token});
        }
  });
router.post('/create',eA,verifyToken,(req,res,next)=>{
    //get time 
    const utc = new Date();
    utc.setHours( utc.getHours() + 5);
    //******** */
    const {passport_id,name,number,allsum,debtsum,allitems} = req.body;
    const hudud = req.user.hudud || req.body.hudud;
    
    const newDebt = new Debt({
        passport_id,
        name,
        number,
        allsum,
        debtsum,
        'items':allitems,
        hudud, 
        'createdAt':utc       
    });
    newDebt.save((err)=>{
        if(err)
            {
                console.log(err);
                req.flash('danger','xatolik');
                res.redirect('/debt/create');
            }
        else{
            req.flash('info','Qarzdorlik muvaffaqiyatli saqlandi');
            res.redirect('/debt/all');
        }    
    });
});  

/* GET update debt  . */
// debt/update/id
router.get('/update/:id',eA, async(req, res, next)=> { 
    Debt.findById(req.params.id,(err,historyDebts)=>{    
        res.render('debt/update',{title:'Qarzdorlik o`zgartirish','historyDebts':historyDebts,token:global.token});
    });
});

/* POST update debt  . */
// debt/update/id
router.post('/update/:id',eA,verifyToken, (req, res, next)=> { 
    //get time 
    const utc = new Date();
    utc.setHours( utc.getHours() + 5);
    //******** */
    const {sum} = req.body; 
    Debt.updateOne({'_id':req.params.id},{
        $push:{
            history:{
                'taken_name':req.user.name,
                'sum':sum,
                'date':utc
            }
        }
    },(err)=>{
        if(err)
            {
                req.flash('danger','Yuklanishda xatolik mavjud');
                res.redirect('/debt/all');
            }
        else{
            req.flash('info','Muvaffaqiyatli yuklandi ');
            res.redirect('/debt/all');
        }    
    })   
});

module.exports = router;  