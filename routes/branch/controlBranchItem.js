const express = require('express');
const router = express.Router();
const randomize = require('randomatic');
const Branch = require('../../models/Branch');
const {eA,eS,eK,eAdmin} = require('../../middleware/middleware');


// verify token
const verifyToken = require('../../middleware/verifyToken');

/* GET allbranches new item. */
// branch/item/all
router.get('/all',eAdmin, (req, res, next)=> {    
      Branch.findOne({'name': req.user.hudud},(err,items)=>{
        res.render('branch/item/all',{title:'Hamma mahsulotlar',items:items});
      })
  });

/* GET create  new item in branch. */
// branch/item/create
router.get('/create',eAdmin, (req, res, next)=> {
    res.render('branch/item/create',{title:'Mahsulot qo`shish',token:global.token});

});  

/* POST create  new item in branch. */
// branch/item/create
router.post('/create', eAdmin,verifyToken,async(req, res, next)=> {
  let {name,amount,price} = req.body;
  let shtrix_id = req.body.shtrix_id || randomize('0',10);
  await Branch.find({'sklad.name':name,'name':req.user.hudud},(err,item)=>{
    console.log('hudud:' + req.user.hudud);
    if(item.length !=0 ){
      req.flash('danger','Mahsulot avval kiritilgan iltimos bazadan tekshiring');
      res.redirect('/branch/item/create');
    }
    else{
       Branch.updateOne({'name':req.user.hudud},{
        $push:{
            sklad:{
              'name':name,
              'amount':amount,
              'price':price,
              'kod':shtrix_id
            }
        }
      },(err)=>{
        if(err)
          {
            console.log(err);
            req.flash('danger','Mahsulot qo`shilmadi');
            res.redirect('/branch/item/create');
          }
        else{
          req.flash('info','Mahsulot qo`shildi');
          res.redirect('/branch/item/create');
        }
      })
    }
  })
   
});  


/* GET update item in branch. */
// branch/item/update
router.get('/update',eAdmin, async(req, res, next)=> {
 await Branch.findOne({name: req.user.hudud},'sklad',(err,branchItems)=>{
  res.render('branch/item/update',{title:'Mahsulotni o`zgartirish',items:branchItems,token:global.token});
 })
});

/* POST update item in branch. */
// branch/item/update
router.post('/update',eAdmin, async(req, res, next)=> {
  const {name,amount,addsub,price,kod} = req.body;
    console.log('kod',kod);
  changingAmount = parseFloat(amount);
  changingAmount = parseFloat(changingAmount/2);
  await Branch.updateMany(
    {name:req.user.hudud,'sklad.name':name},
      {
        '$set':
        {'sklad.$.price': price,'sklad.$.kod':kod},
      });
  if(addsub == 'sub'){
      await Branch.updateMany(
        {name:req.user.hudud,'sklad.name':name},
          {
            '$inc':
            {'sklad.$.amount': -changingAmount },
          },(err,item)=>{
        res.redirect('/branch/item/update');
      });
}
  else{
      await Branch.updateOne({'sklad.name':name,name:req.user.hudud},{$inc:{'sklad.$.amount': changingAmount }},(err,item)=>{
        if(err)
          console.log(err);
        res.redirect('/branch/item/update');
      })
  }
});

module.exports = router;