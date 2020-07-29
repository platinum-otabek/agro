$(document).ready(function() {
    let allNaqd=0,allTerminal=0;
    $(".naqd").each(function() {
        allNaqd+=parseFloat( $(this).text());
        $('.allSum').text('Jami naqd pul: ' + allNaqd +' so`m');
     });
     $(".terminal").each(function() {
        allTerminal+=parseFloat( $(this).text());
        $('.allTerminal').text('Jami terminal pul: ' + allTerminal + ' so`m');
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
