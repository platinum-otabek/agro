$(document).ready(function(){

    $("#filterTable").on("keyup", function () {
    var value = $(this).val().toLowerCase();
    $("#tableItems #passport_id").filter(function () {
        $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
    });
});
    let allGivenSum=0,remainSum;
    allGivenSum = $('.allDebtSum').text(); 
    $(".debtSum").each(function() {
        allGivenSum -=parseFloat( $(this).text());
        $('.allSum').text(` ${allGivenSum}   so'm`);
     });


     debts.forEach(element => {
         let allDebtSum = element.debtsum;
         element.history.forEach(eachDebt => {
             allDebtSum -= eachDebt.sum
         });
        if(allDebtSum == 0){
            className = 'text-primary';
        }
        else{
            className = 'text-danger ';
        } 
        $('#'+element._id ).addClass(className); // 0 bolsa primary bolmasa danger
        // raqamni bo`lib bo`lib chiqariw uchun
        nStr = allDebtSum;
        nStr += '';
        x = nStr.split('.');
        x1 = x[0];
        x2 = x.length > 1 ? '.' + x[1] : '';
        var rgx = /(\d+)(\d{3})/;
        while (rgx.test(x1)) {
            x1 = x1.replace(rgx, '$1' + '.' + '$2');
        }
         $('#'+element._id ).text(x1+x2);
     });
})
