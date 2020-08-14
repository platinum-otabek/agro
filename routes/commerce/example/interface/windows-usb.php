<?php
/* Change to the correct path if you copy this example! */
require __DIR__ . '/../../vendor/autoload.php';
use Mike42\Escpos\Printer;
use Mike42\Escpos\PrintConnectors\WindowsPrintConnector;

/**
 * Install the printer using USB printing support, and the "Generic / Text Only" driver,
 * then share it (you can use a firewall so that it can only be seen locally).
 *
 * Use a WindowsPrintConnector with the share name to print.
 *
 * Troubleshooting: Fire up a command prompt, and ensure that (if your printer is shared as
 * "Receipt Printer), the following commands work:
 *
 *  echo "Hello World" > testfile
 *  copy testfile "\\%COMPUTERNAME%\Receipt Printer"
 *  del testfile
 */



function print_check($printing_data){

    try {

        // Enter the share name for your USB printer here
        //$connector = null;
        $connector = new WindowsPrintConnector("XP-80C");
         $printer = new Printer($connector);
         $printer -> setTextSize(2, 1);
        foreach($printing_data as $data =>$value ){
                echo $value->name; echo '   ';
                echo $value->amount; echo '   ';
                echo $value->price; echo '   ';
                echo $value->all_price; echo '   ';

                //$printer -> text($value->name,'  ',$value->amount,'  ',$value->price,'  ',$value->all_price,'');

            }
        /* Print a "Hello world" receipt" */

        $printer -> text("temir italiya 6%  1.05  700000  735000\n");
        $printer -> text('Rahmat\n');
        $printer -> cut();
        /* Close printer */
        $printer -> close();
    } catch (Exception $e) {
        echo "Couldn't print to this printer: " . $e -> getMessage() . "\n";
    }
}
$printing_data[] = (object) [
        'name' => 'temir italiya 6%',
        'amount' => '1.05',
        'price' =>'700000',
        'all_price' =>'735000'

];
array_push($printing_data,(object) [
                         'name' => 'temir1 italiya 6%',
                         'amount' => '1.05',
                         'price' =>'700000',
                         'all_price' =>'735000'

                 ]);

print_check($printing_data);

?>