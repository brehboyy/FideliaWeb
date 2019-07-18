(function ($) {
    "use strict";

    $('#selectTable').ready(function () {
        $.ajax({
            url: baseUrl + 'systeme.php/getall',
            type: 'GET',
            cache: false
        }).done(function (response) {
            let result;
            try{

            result = JSON.parse(response);
                console.log(result);
            }
            catch (error) {
            result = response;
            }
            let output = "";
            output += '<option selected value="nope">Selectionner table</option>';
            $.each(result.result, function (key, val) { //Titre	Objet	Type	Catégorie	Date
                output += '<option value="' + val.nom_table + '">' + val.nom_table + '</option>';
            });
            $('#selectTable').html(output);
        }).fail(error => {
            console.log(error);
        });
    });

    $('#selectTable').change(function () {
        if(this.value == 'client'){
            $('.card-footer').css('display', 'block');
        }else{
            $('.card-footer').css('display', 'none');
        }
        if (this.value != 'nope') {
            $.ajax({
                url: baseUrl + 'systeme.php/getAllFromTable/' + this.value,
                type: 'GET',
                cache: false
            }).done(function (response) {
                let result = JSON.parse(response);
                let output = "<tr>";
                $.each(result.result.columns, function (key, val) { //Titre	Objet	Type	Catégorie	Date
                    output += '<th class="text-center">' + val.COLUMN_NAME + '</th>';
                });
                output += '<th class="text-center">Editer</th>';
                output += '<th class="text-center">Supprimer</th>';
                output += '<th class="text-center">Sauvegarder</th>';
                output += "</tr>";
                $('thead').html(output);
                let output2 = "";
                $.each(result.result.data, function (key, val) { //Titre	Objet	Type	Catégorie	Date
                    output2 += '<tr>';
                    let ID_champs = "";
                    let compt = 0;
                    for (var property in val) {
                        if (val.hasOwnProperty(property)) {
                            if (compt == 0){
                                ID_champs = property;
                                output2 += '<td class="pt-3-half" contenteditable="false">' + val[property] + '</td>';
                            }
                            else{
                                output2 += '<td class="pt-3-half" contenteditable="false" value="'+ property +'" id="row'+val[ID_champs] + property + '">' + val[property] + '</td>'; 
                            }
                            compt++;
                        }
                    }
                    output2 += '<td><span class="table-remove"><button type="button" onclick="editRow(' + val[ID_champs] + ')" class="btn btn-secondary btn-rounded btn-sm my-0">Editer</button></span></td>';
                    output2 += '<td><span class="table-remove"><button type="button" onclick="deleteRow(\'' + ID_champs + '\',' + val[ID_champs] + ')" class="btn btn-danger btn-rounded btn-sm my-0">Supprimer</button></span></td>';
                    output2 += '<td><span class="table-remove"><button type="button" onclick="saveRow(' + val[ID_champs] + ')" class="btn btn-success btn-rounded btn-sm my-0">Sauvegarder</button></span></td>';
                    output2 += '</tr>';
                });
                $('tbody').html(output2);
                $('table').ddTableFilter();
            }).fail(error => {
                console.log(error);
            });
        }
    });

    //========================Importer csv ===================================
    $('#impoterCSV').click(function (data) {
        var file_data = $('#pathcsv').prop('files')[0];
        var form_data = new FormData();
        form_data.append('file', file_data);
        $.ajax({
            url: baseUrl + 'systeme.php/importCSV', // point to server-side PHP script 
            dataType: 'text',  // what to expect back from the PHP script, if anything
            cache: false,
            contentType: false,
            processData: false,
            data: form_data,
            type: 'post',
            success: function (php_script_response) {
                console.log(php_script_response);
                let result = JSON.parse(php_script_response);
                $('#selectTable').trigger('change');
                alert(result.message); // display response from the PHP script, if any
            }
        });
    })



    $(document).ready(function () {
        $('.dataTables_length').addClass('bs-select');
        $('.card-footer').css('display', 'none');
    });
    //========================= Set tag =======================================
    $('#setTag').click(function () {
        let listId = [];
        $("tbody > tr:visible").each(function (key, val) {
            listId.push(val.firstChild.innerText);
        });
        $.ajax({
            url: baseUrl + 'tag.php/insertClient',
            type: 'POST',
            data: { 'listId': JSON.stringify(listId), 'nom_tag': JSON.stringify($('#nom_tag').val()) },
            cache: false
        }).done(function (response) {

            console.log(response);

        }).fail(error => {
            console.log(error);
        });
    });
    //========================= End set tag ==========================
    //=========================Dropdown filter table ==========================

 



    //=========================END Dropdown filter table ==========================


})(jQuery);

function deleteRow(nom_champs, id_row) {
    console.log(nom_champs, id_row, $('#selectTable').val());
    $.ajax({
        url: baseUrl + 'systeme.php/delete',
        type: 'POST',
        data: { 'id': id_row, 'table': $('#selectTable').val(), 'champs': nom_champs },
        cache: false
    }).done(function (response) {
        $('#selectTable').trigger('change');

    }).fail(error => {
        console.log(error);
    });
}

function editRow(id_row) {

    $('#row'+id_row+'[contenteditable="false"]').attr('contenteditable', true);

}

function saveRow(id_row) {

    let listAttributs = [];
    let listValeurs = [];
    $('[id^="row'+id_row+'"').each(function() {
        var res = ($(this)[0].id).split(id_row);
        console.log(res[1]);
        console.log($(this)[0].innerText);

            listAttributs.push(res[1]);
            listValeurs.push($(this)[0].innerText);
    });
        console.log(listAttributs);
        console.log(listValeurs);
        console.log($('#selectTable').val());

        $.ajax({
            url: baseUrl + 'systeme.php/updateTable',
            type: 'POST',
            data: { 
                'table': JSON.stringify($('#selectTable').val()),
                'listAttributs': JSON.stringify(listAttributs),
                'listValeurs': JSON.stringify(listValeurs)},
            cache: false
        }).done(function (response) {

            console.log(response);

        }).fail(error => {
            console.log(error);
        });

}