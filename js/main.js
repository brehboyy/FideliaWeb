
(function ($) {
    "use strict";


    /*==================================================================
    [ Focus Contact2 ]*/
    $('.input100').each(function(){
        $(this).on('blur', function(){
            if($(this).val().trim() != "") {
                $(this).addClass('has-val');
            }
            else {
                $(this).removeClass('has-val');
            }
        })    
    })
  
  
    /*==================================================================
    [ Validate ]*/
    var input = $('.validate-input .input100');

    $('.validate-form').on('submit',function(){
        var check = true;

        for(var i=0; i<input.length; i++) {
            if(validate(input[i]) == false){
                showValidate(input[i]);
                check=false;
            }
        }

        return check;
    });


    $('.validate-form .input100').each(function(){
        $(this).focus(function(){
           hideValidate(this);
        });
    });

    function validate (input) {
        if($(input).attr('type') == 'email' || $(input).attr('name') == 'email') {
            if($(input).val().trim().match(/^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{1,5}|[0-9]{1,3})(\]?)$/) == null) {
                return false;
            }
        }
        else {
            if($(input).val().trim() == ''){
                return false;
            }
        }
    }

    function showValidate(input) {
        var thisAlert = $(input).parent();

        $(thisAlert).addClass('alert-validate');
    }

    function hideValidate(input) {
        var thisAlert = $(input).parent();

        $(thisAlert).removeClass('alert-validate');
    }

    function loadMessage(idDiv){
        $.ajax({
            url: 'http://localhost:8888/apifidelia/tests/public/message.php/getall',
            type: 'POST',
            dataType: 'json',
            data: { 'message': JSON.stringify(messageObject) },
            cache: false
          }).done(function (response) {
            let result = JSON.parse(response);
            console.log(result);
            let output = "";
            $.each(result.result, function(key, val){
                output += '<button class="btn btn-primary buttonAllModelRight"></button>';
                output += val.Titre_Modele_Message;
                output += '</button>';
            });
            console.log(output);
        $(idDiv).html(output);

          }).fail(error => {
            console.log(error.responseText);
          });
    }
    

})(jQuery);