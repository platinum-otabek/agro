const express = require('express');
const router = express.Router();
const Branch = require('../../models/Branch');
const Commerce = require('../../models/Commerce');
const execPhp = require('exec-php');
var printCheckPhp = "print_check.php";
const {
  eA,
  eS,
  eK,
  eAdmin
} = require('../../middleware/middleware');

// verify token
const verifyToken = require('../../middleware/verifyToken');


async function updateItem(name, amount, user) {
  changingAmount = parseFloat(amount);
  await Branch.updateOne({
    'sklad.name': name,
    name: user.hudud
  }, {
    $inc: {
      'sklad.$.amount': -changingAmount
    }
  });

}
/* GET commerce page. */
router.get('/', eAdmin, (req, res, next) => {
  
  Branch.findOne({
    name: req.user.hudud
  }, 'sklad', (err, data) => {
    res.render('commerce/commerce', {
      title:'Savdo qilish',
      data: data,
      token:global.token
    });
  })
});

router.post('/',eAdmin,verifyToken ,async (req, res, next) => {
 let allSum = 0,allSolded='',allItemsForPrintingChek='';
  allItemsFromStorage = await Branch.find({
    'name': req.user.hudud
  }, 'sklad');
  //get time 
  const utc = new Date();
  utc.setHours( utc.getHours() + 5);
  //******** */
  const  result = Object.entries(req.body);
  for (let index = 0; index < result.length; index++) {
    element = result[index]; //element[0] mahsulot nomi element[1] mahsulot miqdor

    if (element[0] == 'discount')
      break;
    await updateItem(element[0], element[1], req.user); // mahsulotni bazadan yechadi
    thisItem =  allItemsFromStorage[0].sklad.find(searchingElement=> searchingElement.name==element[0]);
        // get data product name,amount price
    allItemsForPrintingChek += `${element[0]}(${element[1]} * ${parseFloat(thisItem.price)} ) - ${parseFloat(element[1]) * parseFloat(thisItem.price)};`;
    allSum = allSum +  parseFloat(element[1]) * parseFloat(thisItem.price);  
    // console.log('nomi:' + element[0] + 'price' +thisItem.price +'sum:'+ allSum );
    allSolded+=`${element[0]}:${element[1]}\n`; // bazaga yoziw uchun olingan mashulotlarni nomi:sonini yozib boradi
  }
    allItemsForPrintingChek += `Jami: ${allSum}`;
    await execPhp(printCheckPhp, function(error, php, outprint){
        php.print_check(allItemsForPrintingChek,function(err, result, output, printed){
            console.log('output1', output);
            console.log('result',result);
        });
    });
  const newCommerce = new Commerce({
    'items':allSolded,
    'allSum':allSum,
    'naqd':req.body.naqd,
    'terminal':req.body.terminal,
    'discount':req.body.discount, 
    'hudud':req.user.hudud,   
    "transferMoney":req.body.transfer,
    'debt':req.body.debt,
    "createdAt":utc   
  });
  newCommerce.save((err)=>{
    if(err){
      req.flash('danger','Xatolik mavjud');
      res.redirect('/commerce');
    }
    else{
      req.flash('info','Muvaffaqiyatli yuklandi');
      res.redirect('/commerce');
    }
  })
 
});

router.get('/show',eA,async(req,res,next)=>{
  branches = await Branch.find({},'name');
  res.render('commerce/show',{title:'Savdoni ko`rsatish',branches:branches});
})
router.get('/test',(req,res,next)=>{
    let product_name = "temir italiya 6%";
    var argsString =`${product_name} - 735000;agiis fe 6% - 150000;breksel mn - 160000;Jami: -1035000`;
    runner.exec("php7.2 " + printCheckPhp + " " + JSON.stringify(argsString), function(err, phpResponse, stderr) {
        if(err) console.log(err); /* log error */
        console.log( phpResponse );
    });
})

router.post('/show',eA,verifyToken,async (req,res,next)=>{
    let beginTime = new Date(req.body.begin); //kiriitilgan begin vaqtni boslanish
    let finishTime = new Date(req.body.finish);//kiriitilgan finish vaqtni boslanish
    let hudud = req.user.hudud || req.body.hudud;//hudud
   
    await Commerce.find({'createdAt':{$gte:beginTime,$lte:finishTime},'hudud':hudud},async(err,data)=>{
      if(err)
        {
          console.log(err);
          req.flash('danger','Xatolik mavjud');
          res.redirect('/commerce');
        }
      else{           
          res.render('commerce/commerceResult',{commerces:data});
      }
    })
})
module.exports = router;