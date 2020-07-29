const express = require('express');
const router = express.Router();

const Item = require('../../models/Items');
const {eA,eK,eS} = require('../../middleware/middleware'); 

//verify token
const verifyToken = require('../../middleware/verifyToken');

/* GET allitems new item. */
// item/all
router.get('/all',eS, (req, res, next)=> {
  Item.find({},(err,items)=>{
    res.render('item/all',{items:items});
  })
});

/* GET create new item. */
// item/create
router.get('/create',eS, (req, res, next)=> {
  res.render('item/create',{token:global.token});
});

/* POST create new item. */
router.post('/create',eS,verifyToken, (req, res, next)=> {
  const {name,unit,price} = req.body;
  req.checkBody('name','Iltimos mahsulot nomini kiriting').notEmpty();
  req.checkBody('unit','Iltimos mahsulot birligini kiriting').notEmpty();
  const errors = req.validationErrors();
  if(errors)
    {
      res.render('item/create',{errors:errors});
    }
    else{
        const newItem = new Item({
          name,
          unit,
          price
        });
        newItem.save((err,item)=>{
          if(err)
            {
              req.flash('danger','Mahsulot yuklanmadi mahsulot nomini bazadan tekshirib qayta urunib ko`ring');
              res.render('item/create');
            }
          else{
            req.flash('info','Mahsulot muvaffaqiyatli yuklandi');
            res.render('item/create');
          }
        })
    }
});

/* GET delete new item. */
// item/delete/id
router.get('/delete/:id',eS, (req, res, next)=> {
  Item.deleteOne({_id:req.params.id},(err)=>{
    if(err)
      console.log(err);
    else{
      req.flash('info','Mahsulot o`chirildi');
      res.redirect('/item/all')
    }
  })
});



module.exports = router;
