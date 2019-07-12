
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

    $('#inscription').click(function(){
        let form = '<form class="login100-form validate-form" oninput=\'pw2.setCustomValidity(pw1.value !=pw2.value ? "Les mots de passe sont différents" : "")\'><span class="login100-form-title p-b-43">Inscription</span><div class="wrap-input100 validate-input" data-validate=""><input class="input100" type="text" name="nom"><span class="focus-input100"></span><span class="label-input100">Nom</span></div><div class="wrap-input100 validate-input"><input class="input100" type="text" name="prenom"><span class="focus-input100"></span><span class="label-input100">Prenom</span></div><div class="wrap-input100 validate-input"><input class="input100" type="text" name="pseudo"><span class="focus-input100"></span><span class="label-input100">Pseudo</span></div><div class="wrap-input100 validate-input"><input class="input100" type="text" name="fonction"><span class="focus-input100"></span><span class="label-input100">Fonction</span></div><div class="wrap-input100 validate-input" data-validate="Valid email is required: ex@abc.xyz"><input class="input100" type="text" name="email"><span class="focus-input100"></span><span class="label-input100">Email</span></div><div class="wrap-input100 validate-input" data-validate="Password is required"><input class="input100" type="password" name="pw1"><span class="focus-input100"></span><span class="label-input100">Mot de passe</span></div><div class="wrap-input100 validate-input" data-validate="Password is required"><input class="input100" type="password" name="pw2"><span class="focus-input100"></span><span class="label-input100">Confimez le mot de passe</span></div><div class="container-login100-form-btn"><button class="login100-form-btn">S\'inscrire</button></div><div class="text-center p-t-46 p-b-20"><span class="txt2">ou s\'enregistrer avec</span></div><div class="login100-form-social flex-c-m"><a href="#" class="login100-form-social-item flex-c-m bg1 m-r-5"><i class="fa fa-facebook-f" aria-hidden="true"></i></a><a href="#" class="login100-form-social-item flex-c-m bg2 m-r-5"><i class="fa fa-twitter" aria-hidden="true"></i></a></div><div class="text-center p-t-46 p-b-20"><span class="txt2">ou déja inscrit ?<a id="connexion">connectez-vous</a></span></div></form><div class="login100-more" style="background-image: url(\'images/bg-01.jpg\');"></div>';
        $('.wrap-login100').html(form);
    });

    $('#connexion').click(function(){
        let form = '<form class="login100-form validate-form"><span class="login100-form-title p-b-43">Connectez-vous pour continuer</span><div class="wrap-input100 validate-input" data-validate="Valid email is required: ex@abc.xyz"><input class="input100" type="text" name="email"><span class="focus-input100"></span><span class="label-input100">Email</span></div><div class="wrap-input100 validate-input" data-validate="Password is required"><input class="input100" type="password" name="pass"><span class="focus-input100"></span><span class="label-input100">Mot de passe</span></div><div class="flex-sb-m w-full p-t-3 p-b-32"><div class="contact100-form-checkbox"><input class="input-checkbox100" id="ckb1" type="checkbox" name="remember-me"><label class="label-checkbox100" for="ckb1">Se souvenir de moi</label></div><div><a href="#" class="txt1">Mot de passe oublié?</a></div></div><div class="container-login100-form-btn"><button class="login100-form-btn">Connexion</button></div><div class="text-center p-t-46 p-b-20"><span class="txt2">ou <a id="inscription">S\'inscrire</a> avec</span></div><div class="login100-form-social flex-c-m"><a href="#" class="login100-form-social-item flex-c-m bg1 m-r-5"><i class="fa fa-facebook-f" aria-hidden="true"></i></a><a href="#" class="login100-form-social-item flex-c-m bg2 m-r-5"><i class="fa fa-twitter" aria-hidden="true"></i></a></div></form><div class="login100-more" style="background-image: url(\'images/bg-01.jpg\');"></div>';
        $('.wrap-login100').html(form);
    });

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
        $(idDiv).html(output);

          }).fail(error => {
            console.log(error.responseText);
          });
    }
    

})(jQuery);