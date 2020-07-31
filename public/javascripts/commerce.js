data.forEach(element => {});


$(document).ready(function () {


  var addItemsIndex = 1;
  let sum = 0,
    allAddedItems = [];
  $("#filterTable").on("keyup", function () {
    var value = $(this).val().toLowerCase();
    $("#tableItems #items").filter(function () {
      $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
    });
  });
  $('.price').on('click', function (params) {
    sum = 0;
    var rows = document.getElementsByClassName("items");
    for (var i = 0; i < rows.length; i++) {
      name = rows[i].name;
      val = rows[i].value;
      price = data.find(element => element.name === name).price;
      sum += parseFloat(val) * parseFloat(price);
      $('.allSum').text(sum + 'so`m')
    }
  })
  //add item 
  $('.add').on('click', function () {
    var name = $(this).attr('id');
    var searchingData = data.find(element => element.name === name);

    var itemDate =
      "<tr>\
          <td scope='col'>" + name + "</td>\
          <td  scope='col'>\
            <input type='number' class='items' step=0.01 value=0 min=0 max='" + searchingData.amount + "'  name='" + name + "'/>\
          </td>\
          <td scope='col'>" + searchingData.price + "   </td>\
          <td class=' text-center' id='" + name + "'  scope='col'><a href='javascript:void(0);' class='btn btn-danger deleted'>delete</a></td>\
      </tr>"
    var old = $('#addItems').find(`.${name}`);

    var checkingItem = allAddedItems.find(element => element == name);
    if (!checkingItem) {
      allAddedItems.push(name);
      $('#addedItems').append(itemDate);
      addItemsIndex++;
    } else {
      alert('Bu mahsulot avval qo`shilgan')
    }
  });
  //delete item
  $('#addedItems').on('click', '.deleted', function () {
    addItemsIndex--;
    $(this).parent().parent().remove();
    var item = $(this).parent().parent('td')['prevObject'][0]['id'];
    allAddedItems = allAddedItems.filter(element => element != item);
  });
  

});