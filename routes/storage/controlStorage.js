const express = require('express');

const router = express.Router();

const Storage = require('../../models/Storage');
const User = require('../../models/User');
const {eA,eK,eS,} = require('../../middleware/middleware');

// verify token
const verifyToken = require('../../middleware/verifyToken');


/* GET allusers . */
// user/all
router.get('/all',eS, (req, res, next)=> {
    Storage.find({},(err,storages)=>{
        res.render('storage/all',{title:'Hamma olingan mahsulotlar',storages:storages});
    });
});

/* GET create debt . */
// user/all
router.get('/create',eS, async(req, res, next)=> {
    res.render('storage/create',{title:'Qarzdorlik qo`shish',token:global.token});

  });
router.post('/create',eS,verifyToken,(req,res,next)=>{
    //get time 
    const utc = new Date();
    utc.setHours( utc.getHours() + 5);
    //******** */
    const {name,number,allsum,debtsum,allitems,hudud} = req.body;

    const newStorage = new Storage({
        name,
        number,
        allsum,
        debtsum,
        'items':allitems,
        hudud, 
        'createdAt':utc       
    });
    newStorage.save((err)=>{
        if(err)
            {
                req.flash('danger','xatolik');
                res.redirect('/debt/create');
            }
        else{
            req.flash('info','Keltirilgan mahsulotlar muvaffaqiyatli saqlandi');
            res.redirect('/storage/all');
        }    
    });
});  

/* GET update debt  . */
// debt/update/id
router.get('/update/:id',eS, async(req, res, next)=> {
    Storage.findById(req.params.id,(err,historyStorages)=>{
        res.render('storage/update',{title:'Qarzdorlik o`zgartirish','historyStorages':historyStorages,token:global.token});
    });
});

/* POST update debt  . */
// debt/update/id
router.post('/update/:id',eS,verifyToken, (req, res, next)=> {
    //get time 
    const utc = new Date();
    utc.setHours( utc.getHours() + 5);
    //******** */
    const {sum} = req.body; 
    Storage.updateOne({'_id':req.params.id},{
        $push:{
            history:{
                'sum':sum,
                'date':utc
            }
        }
    },(err)=>{
        if(err)
            {
                req.flash('danger','Yuklanishda xatolik mavjud');
                res.redirect('/storage/all');
            }
        else{
            req.flash('info','Muvaffaqiyatli yuklandi ');
            res.redirect('/storage/all');
        }    
    })   
});

module.exports = router;  