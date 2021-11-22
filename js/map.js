










$(document).ready(function() {

    $('#user_in').submit((e) => {
    
        e.preventDefault();
        
        var fdata = $('#userdate').val();
        var action = e.currentTarget.action;
        
        $.ajax({
            type: "POST",
            url: "/get-data",
            async: false,
            data: {udate: fdata},
            dataType: "json",
            success: function(data){

                console.log("Captured data!")
            },
            error: function(jqXHR, textStatus, err){

                alert("Status: " + textStatus + ", Error: " + err);
            }
           
        });
    });

});