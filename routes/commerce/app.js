// // app.js
// var execPhp = require('exec-php');
//
// execPhp('print_check.php', function(error, php, outprint){
//     // outprint is now `One'.
//     let data = 'strings';
//     php.my_function(data,function(err, result, output, printed){
//         console.log('result',result);
//     });
// });

var runner = require('child_process');
var phpScriptPath = "print_check.php";
let product_name = "temir italiya 6%";
var argsString =`${product_name} - 735000;agiis fe 6% - 150000;breksel mn - 160000;Jami: -1035000`;
runner.exec("php " + phpScriptPath + " " + JSON.stringify(argsString), function(err, phpResponse, stderr) {
    if(err) console.log(err); /* log error */
    console.log( phpResponse );
});