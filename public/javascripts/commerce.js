data.forEach(element => {});
let addItemsIndex = 1,sum = 0,allAddedItems = [];
function checkAllSum() {
  sum = 0;
  var rows = document.getElementsByClassName("items");
  if(rows.length == 0){
    $('.allSum').text(sum.toFixed(2) + 'so`m');
  }
  for (var i = 0; i < rows.length; i++) {
    mahsulotNomi = rows[i].name;
    val = rows[i].value;
    price = data.find(element => element.name === mahsulotNomi).price;
    sum += parseFloat(val) * parseFloat(price);
    $('.allSum').text(sum.toFixed(2) + 'so`m')
  }
  return sum;
}
function validateForm() {
  let discount = $("#discount").val();
  let naqd = $("#naqd").val();
  let terminal = $("#terminal").val();
  let transfer = $("#transfer").val();
  let debt = $("#debt").val();
  allProductPrice = checkAllSum();
  allSum = parseFloat(discount)+ parseFloat(naqd)+parseFloat(terminal)+parseFloat(transfer)+parseFloat(debt);
  remainSum = parseFloat(allProductPrice)-allSum;
  allAddedItemsForPrinting();
   if(remainSum < 0){
     alert(`Berilgan jami sum:${allSum} qaytim: ${remainSum*(-1)}`);
     return false;
   }
   else if (remainSum >0){
     alert(`Berilgan jami sum:${allSum} to'lanishi kerak bo'lgan sum:${remainSum}`);
     return false;
   }
   else if(remainSum == 0 && allProductPrice != 0 && allSum != 0){
      let allAddedItems =  allAddedItemsForPrinting();
       $.ajax({
         type: 'post',
         url: 'http://print.xyz/example/interface/windows-usb.php',
         data: {
           argv : allAddedItems,
         },
         success: function (data) {
         }
       });
        return true;
   }
   return false;
}

function allAddedItemsForPrinting(){
  let sum = 0,allAddItems='';
  var rows = document.getElementsByClassName("items");
  if(rows.length == 0){
    $('.allSum').text(sum.toFixed(2) + 'so`m');
  }
  for (var i = 0; i < rows.length; i++) {
    mahsulotNomi = rows[i].name;
    val = rows[i].value;
    price = data.find(element => element.name === mahsulotNomi).price;
    sum += parseFloat(val) * parseFloat(price);
    allAddItems += `${mahsulotNomi} (${val} * ${price}) - ${parseFloat(val) * parseFloat(price)};`;
    //value1(1.05*70) - 73.5; ... ; Jami:-100
  }
  allAddItems += `Jami:-${sum}`;
  return allAddItems;
}
$(document).on('keypress',function(e) {
  if(e.which == 13){

    let name = $('#tableItems #items:visible .add')[0];
    console.log(name['id']);
    addItemToTable(name['id']);
  }
});
// mahsulotni tablega qo`wiw uchun
function addItemToTable(name){
  console.log(name)
  var searchingData = data.find(element => element.name === name); // qo`wilmoqchi bo`lgan mahsulot data
  var itemDate =
      "<tr>\
          <td scope='col'>" + name + "</td>\
          <td  scope='col'>\
            <input type='number' class='items' step=0.01 value=1 min=0 max='" + searchingData.amount + "'  name='" + name + "'/>\
          </td>\
          <td scope='col'>" + searchingData.price + "   </td>\
          <td scope='col'>" + searchingData.kod + "   </td>\
          <td class=' text-center' id='" + name + "'  scope='col'><a href='javascript:void(0);' class='btn btn-danger deleted'>delete</a></td>\
      </tr>"
  var old = $('#addItems').find(`.${name}`);
  var checkingItem = allAddedItems.find(element => element == name);
  if (!checkingItem) {//mahsulot avval qo`wilgan bo`lsa
    allAddedItems.push(name);
    $('#addedItems').append(itemDate);
    addItemsIndex++;
  } else {
    alert('Bu mahsulot avval qo`shilgan');
  }
  checkAllSum();
  $('#filterTableName').val('');
  $('#filterTableName').focus();
}
$(document).ready(function () {

  $("#filterTableName").on("keyup", function () {
    var value = $(this).val().toLowerCase();
    $("#tableItems #items").filter(function () {
      $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
    });
  });

  $('.price').on('click', function (params) {
    checkAllSum();
  })
  //add item 
  $('.add').on('click', function () {
    var name = $(this).attr('id'); // mahsulot nomi
    addItemToTable(name);

  });
  //delete item
  $('#addedItems').on('click', '.deleted', function () {
    addItemsIndex--;
    $(this).parent().parent().remove();
    var item = $(this).parent().parent('td')['prevObject'][0]['id'];
    allAddedItems = allAddedItems.filter(element => element != item);
    checkAllSum();
  });


});