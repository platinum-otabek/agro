$(document).ready(()=>{
    $.post("http://print.xyz/example/interface/windows-usb.php",
        {
            name: "Donald Duck",
            city: "Duckburg"
        },
        function(data,status){
            alert("Data: " + data + "\nStatus: " + status);
        });
})