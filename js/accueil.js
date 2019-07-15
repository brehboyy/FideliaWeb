
let baseUrl = 'http://localhost:8888/apifidelia/tests/public/';
(function ($) {
    "use strict";

    $(document).ready(function () {
        $.ajax({
            url: 'http://localhost:8888/apifidelia/tests/public/message.php/getall',
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
                output += '<td> <span class="table-remove"><button id="deleteLigne' + val.ID_Modele_Message + '(' + val.ID_Modele_Message + ')" type="button" class="btn btn-danger btn-rounded btn-sm my-0">Supprimer</button></span></td>';
                output += '<td class="pt-3-half"><span class="table-up"><a href="#!" class="indigo-text"><i class="fas fa-edit" aria-hidden="true"></i></a></span> </td>';
                output += '<td class="pt-3-half"><span class="table-up"><a href="#!" class="indigo-text"><i class="fas fa-paper-plane" aria-hidden="true"></i></a></span> </td>';
                output += '</tr>';
            });
            console.log($('tbody').html());
            $('tbody').html(output);

            $('table').ddTableFilter();

        }).fail(error => {
            console.log(error.responseText);
        });
    });

    //=========================END Dropdown filter table ==========================


})(jQuery);
