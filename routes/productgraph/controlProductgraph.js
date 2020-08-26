const express = require('express');
const router = express.Router();

const ProductGraph = require('../../models/ProductGraph');
const {eA,eK,eS} = require('../../middleware/middleware');

//verify token
const verifyToken = require('../../middleware/verifyToken');

/* GET allitems new item. */
// /productgraph
router.get('/',(req,res,next)=>{
    res.render('productgraph/search',{token:global.token,'title':'Mahsulotlar grafigi'});
})

router.post('/',eA,verifyToken, async (req, res, next)=> {
    let beginTime = new Date(req.body.begin); //kiriitilgan begin vaqtni boslanish
    let finishTime = new Date(req.body.finish);//kiriitilgan finish vaqtni boslanish
    let hudud = req.user.hudud || req.body.hudud;//hudud
    const promise =  ProductGraph.aggregate([{$match:{
            $and:[
                {'createdAt': {$gte:beginTime}},
                {'createdAt': {$lte:finishTime}},

            ]
            }},
            {
                $group:
                    {
                        _id:{
                            name:'$name'
                        },
                        totalAmount:{$sum:'$amount'},
                    }
            },
            {
                $project:{
                    name:'$_id.name',
                    totalAmount: '$totalAmount'
                }
            }
        ]);
    promise.then((allData)=>{
        console.log(allData)
        res.render('productgraph/show',{"products":allData});
    }).catch((err)=>{
        res.send(err);
    })
});

module.exports = router;