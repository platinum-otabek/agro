const express = require('express');
const router = express.Router();
const randomize = require('randomatic');
const Branch = require('../../models/Branch');
const Expense = require('../../models/Expense');
const {eA,eS,eK,eAdmin} = require('../../middleware/middleware');

// verify token
const verifyToken = require('../../middleware/verifyToken');

/* GET all return products  item. */
// return/all
router.get('/all',eAdmin, (req, res, next)=> {
    Branch.findOne({'name': req.user.hudud},(err,items)=>{
        res.render('branch/item/all',{title:'Hamma mahsulotlar',items:items});
    })
});

/* GET one return products  item. */
// /return
router.get('/',eAdmin, (req, res, next)=> {
    Branch.findOne({'name': req.user.hudud},(err,items)=>{
        res.render('return/update',{title:'Hamma mahsulotlar',items:items});
    })
});

/* POST one return products  item. */
// /return
router.post('/',eAdmin,verifyToken, async (req, res, next)=> {
    let {name,amount,allsum} = req.body;
    changingAmount = parseFloat(amount);
    changingAmount = parseFloat(changingAmount/2);
    await Branch.updateOne({'sklad.name':name,name:req.user.hudud},{$inc:{'sklad.$.amount': changingAmount }},(err,item)=>{
        if(err){
            req.flash('danger','xatolik');
        }
    });
    //get time
    const utc = new Date();
    utc.setHours( utc.getHours() + 5);
    //******** */
    const newExpense = new Expense({
        "reason":`Возврат ${name}:${amount} berilgan sum:${allsum} `,
        "price":allsum,
        'reasonType':'get',
        'name':req.user.name,
        'hudud':req.user.hudud,
        'createdAt':utc
    });
    newExpense.save((err,data)=>{
        if(err){
            req.flash('danger','Kiritilmadi');
            res.redirect('/return');
        }
        else{
            req.flash('info','Muvaffaqiyatli kiritildi');
            res.redirect('/return');
        }
    });

});

module.exports = router;