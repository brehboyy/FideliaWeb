
let baseUrl = 'http://localhost:8888/apifidelia/tests/public/';
(function ($) {
    "use strict";

    
    /*==================================================================
    [ Validate ]*/
    var input = $('.validate-input .input100');

    $('#formConnexion').on('submit',function(){
        var check = true;
        let inputCon = $('#formConnexion :input');
        for(var i=0; i<inputCon.length; i++) {
            if(validate(inputCon[i]) == false){
                showValidate(inputCon[i]);
                check=false;
            }
        }
        if(check){
            $.ajax({
                url: baseUrl + 'user.php/signin',
                type: 'POST',
                data: { 'email' : $( "input[name='email']" ).val() , 'password' : $( "input[name='pass']" ).val() },
                cache: false
            }).done(function (response) {
                let result = JSON.parse(response);
                if(!result.success){
                    check = false;
                    alert(result.message);
                }else{
                    window.location.href = "Accueil.html";
                }
    
            }).fail(error => {
                console.log(error.responseText);
            });
        }

        return false;
    });

    $('#formInscription').on('submit',function(){
        
        let inputIns = $('#formInscription :input');
        var check = true;
        for(var i=0; i<inputIns.length; i++) {
            if(validate(inputIns[i]) == false){
                showValidate(inputIns[i]);
                check=false;
            }
        }
        if(check){
            console.log($( "input[name='emailIns']" ).val(),$( "input[name='passIns']" ).val(),$( "input[name='nom']" ).val(), $( "input[name='prenom']" ).val(), $( "input[name='fonction']" ).val());
            $.ajax({
                url: baseUrl + 'user.php/signup',
                type: 'POST',
                data: {
                     'email' : $( "input[name='emailIns']" ).val(),
                     'password' : $( "input[name='passIns']" ).val(),
                     'nom' : $( "input[name='nom']" ).val(),
                     'prenom' : $( "input[name='prenom']" ).val(),
                     'login' : $( "input[name='login']" ).val(),
                     'fonction' : $( "input[name='fonction']" ).val(),
                     'type' : 'en atente d\'implementation'
                    },
                cache: false
            }).done(function (response) {
                let result = JSON.parse(response);
                if(!result.success){
                    check = false;
                    alert(result.message);
                }else{
                    alert(result.message);
                    $('#formInscription').css("display", "none");
                    $('#formConnexion').css("display", "block");
                }
            }).fail(error => {
                console.log(error.responseText);
            });
        }
        return false;
    });

    $('#goToInscription').click(function(){
        $('#formConnexion').hide('slow', function(){});
        $('#formInscription').show('slow', function(){});
    });

    $('#goToConnexion').click(function(){
        $('#formInscription').hide('slow', function(){});
        $('#formConnexion').show('slow', function(){});
    });

    




    $('.validate-form .input100').each(function(){
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


    //================== Creation des tableau filtrable ==============
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
    
    

})(jQuery);