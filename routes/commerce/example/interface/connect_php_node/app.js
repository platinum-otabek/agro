// // app.js
// var execPhp = require('exec-php');
//
// execPhp('windows-usb.php', function(error, php, outprint){
//     // outprint is now `One'.
//     let data = 'strings';
//     php.my_function(data,function(err, result, output, printed){
//         console.log('result',result);
//     });
// });

var runner = require('child_process');
var phpScriptPath = "windows-usb.php";
let product_name = "temir italiya 6%    ";
product_name = product_name.substr(0,31);
var argsString =`${product_name} - 735000;Jami: -735000`;
runner.exec("php " + phpScriptPath + " " + JSON.stringify(argsString), function(err, phpResponse, stderr) {
    if(err) console.log(err); /* log error */
    console.log( phpResponse );
});