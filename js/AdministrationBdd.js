
(function ($) {
    "use strict";



    $('#selectTable').ready(function () {
        $.ajax({
            url: 'http://localhost:8888/apifidelia/tests/public/systeme.php/getall',
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
                url: 'http://localhost:8888/apifidelia/tests/public/systeme.php/getAllFromTable/' + this.value,
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
                    for (var property in val) {
                        if (val.hasOwnProperty(property)) {
                            output2 += '<td class="pt-3-half" contenteditable="false">' + val[property] + '</td>';
                        }
                    }
                    output2 += '<td><span class="table-remove"><button type="button" class="btn btn-primary btn-rounded btn-sm my-0">Edit</button></span></td>';
                    output2 += '<td><span class="table-remove"><button type="button" class="btn btn-danger btn-rounded btn-sm my-0">Supprimer</button></span></td>';
                    output2 += '</tr>';
                });
                $('tbody').html(output2);
                $('table').ddTableFilter();
            }).fail(error => {
                console.log(error);
            });
        }
    });

    $(document).ready(function () {
        $('.dataTables_length').addClass('bs-select');
    });

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