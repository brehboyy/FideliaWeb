
let baseUrl = 'http://localhost:8888/apifidelia/tests/public/';
(function ($) {
    "use strict";

    $('#selectTable').ready(function () {
        $.ajax({
            url: baseUrl + 'systeme.php/getall',
            type: 'GET',
            cache: false
        }).done(function (response) {
            let result = JSON.parse(response);
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
                output += '<th class="text-center">Edit</th>';
                output += '<th class="text-center">Supprimer</th>';
                output += "</tr>";
                $('thead').html(output);
                let output2 = "";
                $.each(result.result.data, function (key, val) { //Titre	Objet	Type	Catégorie	Date
                    output2 += '<tr>';
                    let ID_champs = "";
                    let compt = 0;
                    for (var property in val) {
                        if (val.hasOwnProperty(property)) {
                            if (compt == 0) ID_champs = property;
                            output2 += '<td class="pt-3-half" contenteditable="false">' + val[property] + '</td>';
                            compt++;
                        }
                    }
                    output2 += '<td><span class="table-remove"><button type="button" class="btn btn-primary btn-rounded btn-sm my-0">Edit</button></span></td>';
                    output2 += '<td><span class="table-remove"><button type="button" onclick="deleteRow(\'' + ID_champs + '\',' + val[ID_champs] + ')" class="btn btn-danger btn-rounded btn-sm my-0">Supprimer</button></span></td>';
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
                let result = JSON.parse(php_script_response);
                alert(result.message); // display response from the PHP script, if any
            }
        });
    })



    $(document).ready(function () {
        $('.dataTables_length').addClass('bs-select');
    });
    //========================= Set tag =======================================
    $('#setTag').click(function () {
        let listId = [];
        $("tbody > tr:visible").each(function (key, val) {
            listId.push(val.firstChild.innerText);
        });
        $.ajax({
            url: baseUrl + 'tag.php/insert',
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

    $.fn.ddTableFilter = function (options) {

        try {

            options = $.extend(true, $.fn.ddTableFilter.defaultOptions, options);
            return this.each(function () {
                /*if ($(this).hasClass('ddtf-processed')) {
                    refreshFilters(this);
                    return;
                }*/
                var table = $(this);
                var start = new Date();

                $('th:visible', table).each(function (index) {
                    if ($(this).hasClass('skip-filter')) return;
                    var selectbox = $('<select>');
                    var values = [];
                    var opts = [];
                    selectbox.append('<option value="--all--">' + $(this).text() + '</option>');

                    var col = $('tr:not(.skip-filter) td:nth-child(' + (index + 1) + ')', table).each(function () {
                        var cellVal = options.valueCallback.apply(this);
                        if (cellVal.length == 0) {
                            cellVal = '--empty--';
                        }
                        $(this).attr('ddtf-value', cellVal);

                        if ($.inArray(cellVal, values) === -1) {
                            var cellText = options.textCallback.apply(this);
                            if (cellText.length == 0) { cellText = options.emptyText; }
                            values.push(cellVal);
                            opts.push({ val: cellVal, text: cellText });
                        }
                    });
                    if (opts.length < options.minOptions) {
                        return;
                    }
                    if (options.sortOpt) {
                        opts.sort(options.sortOptCallback);
                    }
                    $.each(opts, function () {
                        $(selectbox).append('<option value="' + this.val + '">' + this.text + '</option>')
                    });


                    $(this).wrapInner('<div style="display:none">');
                    $(this).append(selectbox);
                    $(selectbox).addClass('browser-default custom-select');
                    selectbox.bind('change', { column: col }, function (event) {
                        var changeStart = new Date();
                        var value = $(this).val();

                        event.data.column.each(function () {
                            if ($(this).attr('ddtf-value') === value || value == '--all--') {
                                $(this).removeClass('ddtf-filtered');
                            }
                            else {
                                $(this).addClass('ddtf-filtered');
                            }
                        });
                        var changeStop = new Date();
                        if (options.debug) {
                            console.log('Search: ' + (changeStop.getTime() - changeStart.getTime()) + 'ms');
                        }
                        refreshFilters(table);

                    });
                    table.addClass('ddtf-processed');
                    if ($.isFunction(options.afterBuild)) {
                        options.afterBuild.apply(table);
                    }
                });

                function refreshFilters(table) {
                    var refreshStart = new Date();
                    $('tr', table).each(function () {
                        var row = $(this);
                        if ($('td.ddtf-filtered', row).length > 0) {
                            options.transition.hide.apply(row, options.transition.options);
                        }
                        else {
                            options.transition.show.apply(row, options.transition.options);
                        }
                    });

                    if ($.isFunction(options.afterFilter)) {
                        options.afterFilter.apply(table);
                    }

                    if (options.debug) {
                        var refreshEnd = new Date();
                        console.log('Refresh: ' + (refreshEnd.getTime() - refreshStart.getTime()) + 'ms');
                    }
                }

                if (options.debug) {
                    var stop = new Date();
                    console.log('Build: ' + (stop.getTime() - start.getTime()) + 'ms');
                }
            });
        } catch (error) { console.error(error); }
    };

    $.fn.ddTableFilter.defaultOptions = {
        valueCallback: function () {
            return encodeURIComponent($.trim($(this).text()));
        },
        textCallback: function () {
            return $.trim($(this).text());
        },
        sortOptCallback: function (a, b) {
            return a.text.toLowerCase() > b.text.toLowerCase();
        },
        afterFilter: null,
        afterBuild: null,
        transition: {
            hide: $.fn.hide,
            show: $.fn.show,
            options: []
        },
        emptyText: '--Empty--',
        sortOpt: true,
        debug: false,
        minOptions: 2
    }



    //=========================END Dropdown filter table ==========================


})(jQuery);

function deleteRow(nom_champs, id_row) {
    console.log(nom_champs, id_row);
    $.ajax({
        url: baseUrl + 'systeme.php/delete',
        type: 'POST',
        data: { 'id': id_row, 'table': $('#selectTable').val(), 'champs': nom_champs },
        cache: false
    }).done(function (response) {

        console.log(response);

    }).fail(error => {
        console.log(error);
    });
}