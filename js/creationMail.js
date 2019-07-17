(function ($) {
    $.ajax({
        url: baseUrl + 'tag.php/getall',
        type: 'GET',
        cache: false
    }).done(function (response) {
        console.log(response);
        let result = JSON.parse(response);
        let output = "";
        output += '<option selected value="-1">Selectionner table</option>';
        $.each(result.result, function (key, val) { //Titre	Objet	Type	Catégorie	Date
            output += '<option value="' + val.Nom_Tag + '">' + val.Nom_Tag + '</option>';
        });
        $('#TagToAdd').html(output);
    }).fail(error => {
        console.log(error);
    });

    var request = function (method, url, data, type, callback) {
        var req = new XMLHttpRequest();
        req.onreadystatechange = function () {
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

    var save = function (filename, content) {
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

    var mergeTags = (function () {
    console.log("test");
        $.ajax({
            url: baseUrl + 'balise.php/getall',
            type: 'GET',
            cache: false
        }).done(function (response) {
            let result = JSON.parse(response);
            var lstBalise = new Array();
            $.each(result.result, function (key, val) {
                lstBalise.push({ name: val.Nom_balise, value: '{{' + val.Nom_balise + '}}' });
            });
            return lstBalise;
        }).fail(error => {
            console.log(error.responseText);
        });

    });

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
        onChange: function (jsonFile, response) {
            console.log('json', jsonFile);
            console.log('response', response);
        },
        onSave: function (jsonFile, htmlFile) {
            let messageObject = {
                'Titre': $('#titre').val(),
                'Corps': htmlFile,
                'Object': $('#object').val(),
                'Type': 'Mail',
                'Categorie': 'Cat1'
            };

            $.ajax({
                url: baseUrl + 'message.php/insertMessage',
                type: 'POST',
                dataType: 'json',
                data: {
                    'message': JSON.stringify(messageObject)
                },
                cache: false
            }).done(function (response) {
                let result = JSON.parse(response);
                alert(result.message);
            }).fail(error => {
                console.log(error.responseText);
            });
            //save('newsletter.html', htmlFile);
        },
        onSaveAsTemplate: function (jsonFile) { // + thumbnail? 
            save('newsletter-template.json', jsonFile);
        },
        onAutoSave: function (jsonFile) { // + thumbnail? 
            console.log(new Date().toISOString() + ' autosaving...');
            window.localStorage.setItem('newsletter.autosave', jsonFile);
        },
        onSend: function (htmlFile) {
            //write your send test function here
        },
        onError: function (errorMessage) {
            console.log('onError ', errorMessage);
        }
    };

    var bee = null;

    var loadTemplate = function (e) {
        var templateFile = e.target.files[0];
        var reader = new FileReader();

        reader.onload = function () {
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
        function (token) {
            BeePlugin.create(token, beeConfig, function (beePluginInstance) {
                bee = beePluginInstance;
                request(
                    'GET',
                    'https://rsrc.getbee.io/api/templates/m-bee',
                    null,
                    null,
                    function (template) {
                        bee.start(template);
                    });
            });
        });

    var allTagsHTML = '';
    var allTagsforBDD = new Array();
    var isfirstvalue = true;
    $("#addTags").click(function () {

        var singleValues = $("#TagToAdd").val();
        if (jQuery.inArray(singleValues, allTagsforBDD) == "-1") {
            allTagsforBDD.push(singleValues);
            allTagsHTML = allTagsHTML + '<button class="btn btn-outline-primary btn-sm">' + singleValues + ' <i class="fas fa-times" ></i> </button>';
            $("#alltags").html("<b>Tags:</b> <br>" + allTagsHTML);

            $("#exampleModalLabel").html('Tag ajouté avec succès');
        } else {
            $("#exampleModalLabel").html('Ce tag a déjà été ajouté !');
        }
    });


})(jQuery);