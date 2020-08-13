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

var exexPhp = require('exec-php');
var phpScriptPath = "print_check.php";
let product_name = "temir italiya 6%";
var argsString =`${product_name} - 735000;agiis fe 6% - 150000;breksel mn - 160000;Jami: -1035000`;
execPhp(phpScriptPath, function(error, php, outprint){
    php.print_check(argsString,function(err, result, output, printed){
        console.log('output1', output);
        console.log('result',result);
    });
});