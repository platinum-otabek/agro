<?php
require __DIR__ . '/vendor/autoload.php';
use Mike42\Escpos\Printer;
use Mike42\Escpos\PrintConnectors\WindowsPrintConnector;

try{
    $params = explode(';',$argv[1]);
    /* Fill in your own connector here */
    print_r($params);
    $connector = new WindowsPrintConnector("XP-80C");
    $printer = new Printer($connector);
    /* Information for the receipt */
    $total ='as';
    $ites = array();
    for($i=0;$i<count($params);$i++){
        echo $params[$i];
        $itemPrice = explode('-',$params[$i]);
        if( strpos($params[$i],'Jami:') !== false){
            $total = new item('Jami:', $itemPrice[1], true);
            break;
        }
        $items[$i] = new item($itemPrice[0],$itemPrice[1]);
    }
// set default timezone
    date_default_timezone_set('Asia/Tashkent'); // CDT
    $date = date('d/m/Y == H:i:s');



    /* Print top logo */
    $printer -> setJustification(Printer::JUSTIFY_CENTER);


    /* Name of shop */
    $printer -> selectPrintMode(Printer::MODE_DOUBLE_WIDTH);
    $printer -> text("Agrogreen Planet LLc.\n");
    $printer -> selectPrintMode();
    $printer -> feed();

    /* Title of receipt */
    $printer -> setEmphasis(true);
//$printer -> text("SALES INVOICE\n");
    $printer -> setEmphasis(false);

    /* Items */
    $printer -> setJustification(Printer::JUSTIFY_LEFT);
    $printer -> setEmphasis(true);
    $printer -> text(new item('', 'so`m'));
    $printer -> setEmphasis(false);
    foreach ($items as $item) {
        $printer -> text($item);
    }
    if ($total){
        $printer -> selectPrintMode(Printer::MODE_DOUBLE_WIDTH);
        $printer -> text($total);
    }

    $printer -> selectPrintMode();

    /* Footer */
    $printer -> feed(2);
    $printer -> setJustification(Printer::JUSTIFY_CENTER);
    $printer -> text("Xaridingiz uchun rahmat\n");
    $printer -> feed(2);
    $printer -> text($date . "\n");

    /* Cut the receipt and open the cash drawer */
    $printer -> cut();
    $printer -> pulse();

    $printer -> close();
}catch (Exception $e) {
    echo "Couldn't print to this printer: " . $e -> getMessage() . "\n";
}

/* A wrapper to do organise item names & prices into columns */
class item
{
    private $name;
    private $price;
    private $dollarSign;

    public function __construct($name = '', $price = '', $dollarSign = false)
    {
        $this -> name = $name;
        $this -> price = $price;
        $this -> dollarSign = $dollarSign;
    }

    public function __toString()
    {
        $rightCols = 10;
        $leftCols = 38;
        if ($this -> dollarSign) {
            $leftCols = $leftCols / 2 - $rightCols / 2;
        }
        $left = str_pad($this -> name, $leftCols) ;

        $sign = ($this -> dollarSign ? '' : '');
        $right = str_pad($sign . $this -> price, $rightCols, ' ', STR_PAD_LEFT);
        return "$left$right\n";
    }
}

