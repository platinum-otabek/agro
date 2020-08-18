data.forEach(element => {});
$(document).ready(()=>{
    $('.name').change(function () {
        let name = $(this).val();
        let item = data.find(element => element.name == name);
        $('#kod').val(item.kod);
        $('#price').val(item.price);
    })
})