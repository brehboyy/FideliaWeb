(function ($) {
    "use strict";

    var gettabmsg = function () {
        $.ajax({
            url: baseUrl + 'message.php/getall',
            type: 'GET',
            cache: false
        }).done(function (response) {
            let result = JSON.parse(response);
            let output = "";
            $.each(result.result, function (key, val) {
                output += '<tr>';
                output += '<td class="pt-3-half" contenteditable="false">' + val.Titre_Modele_Message + '</td>';
                output += '<td class="pt-3-half" contenteditable="false">' + val.Objet_Modele_Message + '</td>';
                output += '<td class="pt-3-half" contenteditable="false">' + val.Type_Modele_Message + '</td>';
                output += '<td class="pt-3-half" contenteditable="false">' + val.Categorie_Modele_Message + '</td>';
                output += '<td class="pt-3-half" contenteditable="false">' + val.Date_Modele_Message + '</td>';
                output += '<td class="pt-3-half" contenteditable="false" width="150px">'                        
                output += '<select class="browser-default custom-select test" id="statut">'
                output += '<option value="EN COURS,'+val.ID_Modele_Message+'"  '+( val.Statut_Message == "EN COURS" ? 'selected' : '')+'>EN COURS</option>';
                output += '<option value="ARCHIVE,'+val.ID_Modele_Message+'" '+( val.Statut_Message == "ARCHIVE" ? 'selected' : '')+'>ARCHIVE</option>';
                output += '<option value="EN ATTENTE,'+val.ID_Modele_Message+'" '+( val.Statut_Message == "EN ATTENTE" ? 'selected' : '')+'>EN ATTENTE</option>';
                output += '</select></td>';
                output += '<td> <span class="table-remove"><button onclick="deleteRow('+ val.ID_Modele_Message+ ')" type="button" class="btn btn-danger btn-rounded btn-sm my-0">Supprimer</button></span></td>';
                output += '<td> <span class="table-remove"><a href="CreationMailPage.html?ID_Modele_Message='+val.ID_Modele_Message+'" type="button" class="indigo-text"><i class="fas fa-edit" aria-hidden="true"></i></a></span></td>';
                output += '<td> <span class="table-remove"><button type="button" class="green-text program" data-toggle="modal" data-target="#basicExampleModal" value="'+val.ID_Modele_Message+'"><i class="fas fa-paper-plane" aria-hidden="true"></i></button></span></td>';
                output += '</tr>';

            });
            $('tbody').html(output);

            $('table').ddTableFilter();

        }).fail(error => {
            console.log(error.responseText);
        });


    };

    $(document).ready(gettabmsg);
    //=========================END Dropdown filter table ==========================

})(jQuery);
  
    $('.inputfrequence').each(function(){
        $(this).focus(function(){
           hideValidate(this);
        });
    });

    function validate (input) {
        if(input.localName == 'input'){
            if($(input).attr('type') == 'email' || $(input).attr('name') == 'email') {
                if($(input).val().trim().match(/^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{1,5}|[0-9]{1,3})(\]?)$/) == null) {
                    return false;
                }
            }else if ($(input).attr('name') == 'login' || ($(input).attr('name') == 'pass')){
                if($(input).val().trim().length < 4)
                return false;
            }
            else {
                if($(input).val().trim() == ''){
                    return false;
                }
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
      $(document).on('change', '#statut', function() {  
           Message =$(this).val();  
           console.log(Message);
           var res = Message.split(",");
           let messageObject = {
                'Id': res[1],
                'Status': res[0]
            };
                $.ajax({
                    url: baseUrl + 'message.php/updateStatusMessage',
                    type: 'POST',
                    dataType: 'json',
                    data: {
                        'message': JSON.stringify(messageObject)
                    },
                    cache: false
                }).done(function(response) {
                    console.log(response);
                       let resultat;
                        try {
                            resultat = JSON.parse(response);
                        } catch (error) {
                            resultat = response;
                        }
                }).fail(error => {
                    console.log(error.responseText);
                });
        });

    var ID_Modele_Message;
    $("tbody").on('click', '.program', function() {  
           ID_Modele_Message =$(this).val();
           console.log(ID_Modele_Message);
        });
          var result = 'Permanent';
      $(document).ready(function(){
          $( "#occasionnellement" ).hide();
          $('.permanent input[type="radio"]').click(function(){
            result = $(this).val();
            switch(result){
              case 'Occasionnellement':
                $( "#permanent" ).hide( "slow", function() {
                });
               $( "#occasionnellement" ).show( "slow", function() {
                });
              break;
              case 'Permanent':
                $( "#permanent" ).show( "slow", function() {
                });
               $( "#occasionnellement" ).hide( "slow", function() {
                });
              break; 
            }
        console.log(result);
          });
      
      
      $('#dateOcca').change(function(){
          var inputdateOcca = new Date(this.value);
          dateOcca = inputdateOcca.getFullYear() + '-' + (inputdateOcca.getMonth()+1) + '-' + inputdateOcca.getDate() + ' ' + inputdateOcca.getHours() + ':' + inputdateOcca.getMinutes() +':' + inputdateOcca.getSeconds()
          console.log('Date occasionnellement (dateOcca) : ' + dateOcca);
      });
      $('#dateDebut').change(function(){
          var inputdateDebut = new Date(this.value);
          dateDebut = inputdateDebut.getFullYear() + '-' + (inputdateDebut.getMonth()+1) + '-' + inputdateDebut.getDate() + ' ' + inputdateDebut.getHours() + ':' + inputdateDebut.getMinutes() +':' + inputdateDebut.getSeconds();
          console.log('Date début permanent (dateDebut) : ' + dateDebut);

      });
      $('#sendNow').click(function(){
        console.log(ID_Modele_Message);

        $.ajax({
        url: baseUrl + 'message.php/envoyer',
        type: 'POST',
        data: { 'Id': ID_Modele_Message },
        cache: false
        }).done(function(response) {
                    console.log(response);
                       let resultat;
                        try {
                            resultat = JSON.parse(response);
                        } catch (error) {
                            resultat = response;
                        }
                }).fail(error => {
                    console.log(error.responseText);
                });
        });
      $('#sauvegarder').submit(function(){
        let inputIns = $('#sauvegarder :input');
        var check = true;
        for(var i=0; i<inputIns.length; i++) {
            if(validate(inputIns[i]) == false){
                showValidate(inputIns[i]);
                check=false;
            }
        }
          var selectCondition = $( "#selectCondition option:selected" ).text();
          if (selectCondition == 'Condition') {selectCondition = 'Aucune condition'}
          var numberFrequence = $('#numberFrequence').val();
          var dateEnvoi;
            switch(result){
              case 'Occasionnellement':
                dateEnvoi = dateOcca;
                numberFrequence = 0;
                console.log(ID_Modele_Message);
                console.log(numberFrequence);
                console.log(dateOcca);
                console.log(result);
              break;
              case 'Permanent':
                dateEnvoi = dateDebut;
                console.log(ID_Modele_Message);
                console.log(numberFrequence);
                console.log(dateDebut);
                console.log(result);
              break; 
            }

            let programmationObject = { 
              'ID_Modele_Message': ID_Modele_Message,
              'NbTempsJour': numberFrequence, 
              'DateEnvoi': dateEnvoi, 
              'Condition': selectCondition };
        
            $.ajax({
              url: baseUrl + 'message.php/insertProgrammation',
              type: 'POST',
              dataType: 'json',
              data: { 'programmation': JSON.stringify(programmationObject) },
              cache: false
            }).done(function (response) {
              alert(response.message);
            }).fail(error => {
              console.log(error.responseText);
            });
            return false;
          })
        });


function deleteRow(id_row) {
    $.ajax({
        url: baseUrl + 'message.php/delete',
        type: 'POST',
        data: { 'id': id_row },
        cache: false
    }).done(function (response) {
        let result1 = JSON.parse(response);
        if(result1.success){
            $.ajax({
                url: baseUrl + 'message.php/getall',
                type: 'GET',
                cache: false
            }).done(function (response) {
                let result = JSON.parse(response);
                let output = "";
                $.each(result.result, function (key, val) {
                output += '<tr>';
                output += '<td class="pt-3-half" contenteditable="false">' + val.Titre_Modele_Message + '</td>';
                output += '<td class="pt-3-half" contenteditable="false">' + val.Objet_Modele_Message + '</td>';
                output += '<td class="pt-3-half" contenteditable="false">' + val.Type_Modele_Message + '</td>';
                output += '<td class="pt-3-half" contenteditable="false">' + val.Categorie_Modele_Message + '</td>';
                output += '<td class="pt-3-half" contenteditable="false">' + val.Date_Modele_Message + '</td>';
                output += '<td class="pt-3-half" contenteditable="false" width="150px">'                        
                output += '<select class="browser-default custom-select" id="statut'+val.ID_Modele_Message+'">'
                output += '<option value="EN COURS"  '+( val.Statut_Message == "EN COURS" ? 'selected' : '')+'>EN COUR</option>';
                output += '<option value="ARCHIVE" '+( val.Statut_Message == "ARCHIVE" ? 'selected' : '')+'>ARCHIVE</option>';
                output += '<option value="EN ATTENTE" '+( val.Statut_Message == "EN ATTENTE" ? 'selected' : '')+'>EN ATTENTE</option>';
                output += '</select></td>';
                output += '<td> <span class="table-remove"><button onclick="deleteRow('+ val.ID_Modele_Message+ ')" type="button" class="btn btn-danger btn-rounded btn-sm my-0">Supprimer</button></span></td>';
                output += '<td> <span class="table-remove"><a href="CreationMailPage.html?ID_Modele_Message='+val.ID_Modele_Message+'" type="button" class="indigo-text"><i class="fas fa-edit" aria-hidden="true"></i></a></span></td>';
                output += '<td> <span class="table-remove"><button type="button" class="green-text program" data-toggle="modal" data-target="#basicExampleModal" value="'+val.ID_Modele_Message+'"><i class="fas fa-paper-plane" aria-hidden="true"></i></button></span></td>';
                output += '</tr>';

                });
                $('tbody').html(output);
    
                $('table').ddTableFilter();
    
            }).fail(error => {
                console.log(error.responseText);
            });
        }else{
            alert(result1.message);
        }

    }).fail(error => {
        console.log(error);
    });

}
