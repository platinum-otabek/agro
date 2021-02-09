const express = require('express');
const router = express.Router();

const Branch = require('../../models/Branch');
const {eA,eK,eS} = require('../../middleware/middleware');


// verify token
const verifyToken = require('../../middleware/verifyToken');

/* GET allbranches new item. */
// branch/all
router.get('/all',eS, (req, res, next)=> { 
 
    Branch.find({},(err,branchs)=>{
      res.render('branch/all',{title:'Hamma filiallar',branchs:branchs});
    })
  });

/* GET create new branch. */
// branch/create
router.get('/create',eK, (req, res, next)=> {
    res.render('branch/create',{title:'Filial qo`shish',token:global.token});
});
 
/* POST create new item. */
router.post('/create',eK,verifyToken, (req, res, next)=> {
  const {name,desc} = req.body;
  req.checkBody('name','Iltimos filial nomini kiriting').notEmpty();
  req.checkBody('desc','Iltimos mahsulot birligini kiriting').notEmpty();
  const errors = req.validationErrors();
  if(errors)
    {
        console.log(errors);
      res.render('branch/create',{title:'Filial qo`shish',errors:errors});
    }
    else{
        const newBranch = new Branch({
          name,
          desc
        });
        newBranch.save((err,branch)=>{
          if(err)
            {
              console.log(err);
              req.flash('danger','Filial yuklanmadi filial nomini bazadan tekshirib qayta urunib ko`ring');
              res.render('branch/create',{title:'Filial qo`shish'});
            }
          else{
            req.flash('info','Filial muvaffaqiyatli yuklandi');
            res.redirect('/branch/all');
          }
        })
    }
});

/* GET delete new item. */
// item/delete/id
router.get('/delete/:id',eK, (req, res, next)=> {
    Branch.deleteOne({_id:req.params.id},(err)=>{
      if(err)
        console.log(err);
      else{
        req.flash('info','Filial o`chirildi');
        res.redirect('/branch/all')
      }
    })
  });

  module.exports = router;