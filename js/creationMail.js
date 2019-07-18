(function($) {
    var allTagsforBDD = new Array();
    $.ajax({
        url: baseUrl + 'tag.php/getall',
        type: 'GET',
        cache: false
    }).done(function(response) {
        let result;
        try {
            result = JSON.parse(response);
        } catch (error) {
            result = response;
        }
        let output = "";
        output += '<option selected value="-1">Selectionner table</option>';
        $.each(result.result, function(key, val) { //Titre    Objet    Type    Catégorie    Date
            output += '<option value="' + val.Nom_Tag + '">' + val.Nom_Tag + '</option>';
        });
        $('#TagToAdd').html(output);
    }).fail(error => {
        console.log(error);
    });

    var request = function(method, url, data, type, callback) {
        var req = new XMLHttpRequest();
        req.onreadystatechange = function() {
            if (req.readyState === 4 && req.status === 200) {
                var response = JSON.parse(req.responseText);
                callback(response);
            } else if (req.readyState === 4 && req.status !== 200) {
                console.error('Access denied, invalid credentials. Please check you entered a valid client_id and client_secret.');
            }
        };

        req.open(method, url, true);
        if (data && type) {
            if (type === 'multipart/form-data') {
                var formData = new FormData();
                for (var key in data) {
                    formData.append(key, data[key]);
                }
                data = formData;
            } else {
                req.setRequestHeader('Content-type', type);
            }
        }

        req.send(data);
    };

    var save = function(filename, content) {
        saveAs(
            new Blob([content], {
                type: 'text/plain;charset=utf-8'
            }),
            filename
        );
    };

    var specialLinks = [{
        type: 'unsubscribe',
        label: 'SpecialLink.Unsubscribe',
        link: 'http://[unsubscribe]/'
    }, {
        type: 'subscribe',
        label: 'SpecialLink.Subscribe',
        link: 'http://[subscribe]/'
    }];

    let mergeTags = function() {
        var lstBalise = [];
        $.ajax({
            url: baseUrl + 'balise.php/getall',
            type: 'GET',
            cache: false
        }).done(function(response) {
            let result = JSON.parse(response);
            $.each(result.result, function(key, val) {
                lstBalise.push({
                    name: val.Nom_balise,
                    value: '{{' + val.Nom_balise + '}}'
                });
            });
        }).fail(error => {
            console.log(error);
        });
        return lstBalise;
    }();

    var mergeContents = [{
        name: 'content 1',
        value: '[content1]'
    }, {
        name: 'content 2',
        value: '[content1]'
    }];

    function userInput(message, sample) {
        return function handler(resolve, reject) {
            var data = prompt(message, JSON.stringify(sample))
            return (data == null || data == '') ? reject() : resolve(JSON.parse(data))
        }
    }

    var beeConfig = {
        uid: 'test1-clientside',
        container: 'bee-plugin-container',
        autosave: 30,
        language: 'fr-FR',
        trackChanges: true,
        specialLinks: specialLinks,
        mergeTags: mergeTags,
        mergeContents: mergeContents,
        contentDialog: {
            specialLinks: {
                label: 'Add a custom Special Link',
                handler: userInput('Enter the deep link:', {
                    type: 'custom',
                    label: 'external special link',
                    link: 'http://www.example.com'
                })
            },
            mergeTags: {
                label: 'Add custom tag 2',
                handler: userInput('Enter the merge tag:', {
                    name: 'name',
                    value: '[name]'
                })
            },
            mergeContents: {
                label: 'Choose a custom merge content',
                handler: userInput('Enter the merge content:', {
                    name: 'my custom content',
                    value: '{my-custom-content}'
                })
            },
            rowDisplayConditions: {
                label: 'Open builder',
                handler: userInput('Enter the row display condition:', {
                    type: 'People',
                    label: 'Person is a developer',
                    description: 'Check if a person is a developer',
                    before: "{if job == 'developer'}",
                    after: '{endif}'
                })
            },
        },
        onChange: function(jsonFile, response) {
            console.log('json', jsonFile);
            console.log('response', response);
        },
        onSave: function(jsonFile, htmlFile) {
                var getUrlParameter = function getUrlParameter(sParam) {
                    var sPageURL = window.location.search.substring(1),
                        sURLVariables = sPageURL.split('&'),
                        sParameterName,
                        i;

                    for (i = 0; i < sURLVariables.length; i++) {
                        sParameterName = sURLVariables[i].split('=');

                        if (sParameterName[0] === sParam) {
                            return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
                        }
                    }
                };

            var ID_Modele_Message = getUrlParameter('ID_Modele_Message');
            if (typeof ID_Modele_Message === "undefined") {
                ID_Modele_Message = 0;
            }
            let messageObject = {
                'Id': ID_Modele_Message,
                'Titre': $('#titre').val(),
                'Corps': htmlFile,
                'Object': $('#object').val(),
                'Type': 'Mail',
                'Categorie': $('#categorie').val(),
                'Template': jsonFile,
                'ListTag': allTagsforBDD
            };

                var result;
                var exist = false;
                    $.ajax({
                        url: baseUrl + 'message.php/existById/' + ID_Modele_Message,
                        type: 'GET'
                    }).done(function(response) {
                        result = (JSON.parse(response)).result;
                        console.log(result);
            if (result == false) {
                $.ajax({
                    url: baseUrl + 'message.php/insertMessage',
                    type: 'POST',
                    dataType: 'json',
                    data: {
                        'message': JSON.stringify(messageObject)
                    },
                    cache: false
                }).done(function(response) {
                    alert(response.message);
                }).fail(error => {
                    console.log(error.responseText);
                });
            }
            else{
                $.ajax({
                    url: baseUrl + 'message.php/updateMessage',
                    type: 'POST',
                    dataType: 'json',
                    data: {
                        'message': JSON.stringify(messageObject)
                    },
                    cache: false
                }).done(function(response) {
                       let resultat;
                        try {
                            resultat = JSON.parse(response);
                        } catch (error) {
                            resultat = response;
                        }
                }).fail(error => {
                    console.log(error.responseText);
                });
            }
                    }).fail(error => {
                        console.log(error);
                    });
               

        },
        onSaveAsTemplate: function(jsonFile) { // + thumbnail? 
            save('newsletter-template.json', jsonFile);
        },
        onAutoSave: function(jsonFile) { // + thumbnail? 
            console.log(new Date().toISOString() + ' autosaving...');
            window.localStorage.setItem('newsletter.autosave', jsonFile);
        },
        onSend: function(htmlFile) {
            //write your send test function here
        },
        onError: function(errorMessage) {
            console.log('onError ', errorMessage);
        }
    };

    var bee = null;

    var loadTemplate = function(e) {
        var templateFile = e.target.files[0];
        var reader = new FileReader();

        reader.onload = function() {
            var templateString = reader.result;
            var template = JSON.parse(templateString);
            bee.load(template);
        };

        reader.readAsText(templateFile);
    };

    document.getElementById('choose-template').addEventListener('change', loadTemplate, false);

    request(
        'POST',
        'https://auth.getbee.io/apiauth',
        'grant_type=password&client_id=08be1dd5-13ac-4744-8b55-f3748fdd7406&client_secret=KSNip7ZOqbCzkxOnLaHOmQWWxf6xr8LuDRGFFcfkX0gmzsIAaDi0',
        'application/x-www-form-urlencoded',
        function(token) {

            BeePlugin.create(token, beeConfig, function(beePluginInstance) {
                bee = beePluginInstance;

                var getUrlParameter = function getUrlParameter(sParam) {
                    var sPageURL = window.location.search.substring(1),
                        sURLVariables = sPageURL.split('&'),
                        sParameterName,
                        i;

                    for (i = 0; i < sURLVariables.length; i++) {
                        sParameterName = sURLVariables[i].split('=');

                        if (sParameterName[0] === sParam) {
                            return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
                        }
                    }
                };

                var ID_Modele_Message = getUrlParameter('ID_Modele_Message');
                if (ID_Modele_Message != null) {
                    $.ajax({
                        url: baseUrl + 'message.php/GetById/' + ID_Modele_Message,
                        type: 'GET'
                    }).done(function(response) {
                        let result;
                        try {

                            result = JSON.parse(response);
                        } catch (error) {
                            result = response;
                        }
                        $("#titre").val(result.result[0].Titre_Modele_Message);
                        $("#object").val(result.result[0].Objet_Modele_Message);
                        //$("div.typeclient select").val(result.result[0].Objet_Modele_Message);
                        $("div.typeEvenement select").val(result.result[0].Categorie_Modele_Message);
                        bee.start(JSON.parse(result.result[0].Template_Modele_Message));
                    }).fail(error => {
                        console.log(error);
                    });
                } else {
                    $.ajax({
                        url: baseUrl + 'message.php/GetById/' + 3,
                        type: 'GET'
                    }).done(function(response) {
                        let result;
                        try {

                            result = JSON.parse(response);
                        } catch (error) {
                            result = response;
                        }
                        $("#titre").val(result.result[0].Titre_Modele_Message);
                        $("#object").val(result.result[0].Objet_Modele_Message);
                        //$("div.typeclient select").val(result.result[0].Objet_Modele_Message);
                        $("div.typeEvenement select").val(result.result[0].Categorie_Modele_Message);
                        bee.start(JSON.parse(result.result[0].Template_Modele_Message));
                    }).fail(error => {
                        console.log(error);
                    });
                }
            });
        });
    $("#addTags").click(function() {

        var allTagsHTML = '';
        var singleValues = $("#TagToAdd").val();
        if (jQuery.inArray(singleValues, allTagsforBDD) == "-1") {
            allTagsforBDD.push(singleValues);
            // foreach
            // add to allTagsHTML
            $.each(allTagsforBDD, function(index, value) {
                allTagsHTML = allTagsHTML + '<button class="btn btn-outline-primary btn-sm test" id="delTags' + value + ' " value="' + value + '">' + value + ' <i class="fas fa-times" ></i> </button>';

            });
            $("#alltags").html("<b>Tags:</b> <br>" + allTagsHTML);

            $("#exampleModalLabel").html('Tag ajouté avec succès');
        } else {
            $("#exampleModalLabel").html('Ce tag a déjà été ajouté !');
        }
    });
    $("#alltags").on('click', 'button', function() {
        var allTagsHTML = '';
        var tag = $(this).val();
        allTagsforBDD = jQuery.grep(allTagsforBDD, function(value) {
            return value != tag;
        });
        // foreach
        // add to allTagsHTML
        $.each(allTagsforBDD, function(index, value) {
            allTagsHTML = allTagsHTML + '<button class="btn btn-outline-primary btn-sm test" id="delTags' + value + ' " value="' + value + '">' + value + ' <i class="fas fa-times" ></i> </button>';

        });
        $("#alltags").html("<b>Tags:</b> <br>" + allTagsHTML);
    });

})(jQuery);