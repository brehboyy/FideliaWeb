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

    var ID_Modele_Message;
    $("tbody").on('click', '.program', function() {  
           ID_Modele_Message =$(this).val();  
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
      
      $('#sauvegarder').submit(function(){
           console.log(result);
          var selectCondition = $( "#selectCondition option:selected" ).text();
          if (selectCondition = 'Condition') {selectCondition = 'Aucune condition'}
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
              url: 'http://localhost/apifidelia/tests/public/message.php/insertProgrammation',
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
