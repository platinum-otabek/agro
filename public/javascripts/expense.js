$(document).ready(function() {
    let allExpense=0;
    $(".expense").each(function() {
        allExpense+=parseFloat( $(this).text());
        $('.allExpense').text('Jami xarajat: ' + allExpense +' so`m');
     });
     
    $(".numbers").each(function() {
       nStr = $(this).text();
       nStr += '';
        x = nStr.split('.');
        x1 = x[0];
        x2 = x.length > 1 ? '.' + x[1] : '';
        var rgx = /(\d+)(\d{3})/;
        while (rgx.test(x1)) {
            x1 = x1.replace(rgx, '$1' + '.' + '$2');
        }
        $(this).text(x1+x2);
    });
    
});
