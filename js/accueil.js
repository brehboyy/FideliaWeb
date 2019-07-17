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
                output += '<td> <span class="table-remove"><button onclick="deleteRow('+ val.ID_Modele_Message+ ')"  type="button" class="btn btn-danger btn-rounded btn-sm my-0">Supprimer</button></span></td>';
                output += '<td class="pt-3-half"><span class="table-up"><a href="#!" class="indigo-text"><i class="fas fa-edit" aria-hidden="true"></i></a></span> </td>';
                output += '<td> <span class="table-remove"><button type="button" class="green-text" data-toggle="modal" data-target="#basicExampleModal"><i class="fas fa-paper-plane" aria-hidden="true"></i></button></span></td>';
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
                    output += '<td> <span class="table-remove"><button onclick="deleteRow('+ val.ID_Modele_Message+ ')"  type="button" class="btn btn-danger btn-rounded btn-sm my-0">Supprimer</button></span></td>';
                    output += '<td class="pt-3-half"><span class="table-up"><a href="#!" class="indigo-text"><i class="fas fa-edit" aria-hidden="true"></i></a></span> </td>';
                    output += '<td class="pt-3-half"><span class="table-up"><a href="#!" class="indigo-text"><i class="fas fa-paper-plane" aria-hidden="true"></i></a></span> </td>';
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
