/**
 * Created by prabh on 2016-06-14.
 */

//Without JQuery
var countries = new Array();
var zones = new Array();

function listAddons() {
    var country = document.travel.country.value;

    searchThrough(country);
    for (i = 0; i < countries.length; i++) {
        console.log("Array:" + countries[i]);
    }

    //Add required Attribute to all input fields
    $("input").prop('required', true);

}
function searchThrough(country) {
    $.getJSON("data/countries.json")
        .done(function (d) {
                $.each(d, function (index, value) {
                    var i = 0;
                    if (zones[index] != null) {
                        zones.push(index);
                    }
                    for (key in value) {
                        if (countries[index] != null) {
                            countries.push(value[i].country);
                        }
                        if (country === value[i].country) {
                            if (sessionStorage.getItem("country") == country) {
                                displayRelAdd(index);
                                $("#" + index).scrollTop;
                            }

                            else {
                                displayRelAdd(index);
                                $('body').animate({scrollTop: $("#" + index).offset().top}, 2000);
                            }
                        }
                        i++;
                    }

                });

            }
        )
        .fail(function (jqxhr, textStatus, error) {
            var err = textStatus + ", " + error;
            console.log("Request Failed to the Database Countries: " + err);
        });
}

function clearChecksinSS() {
    for (var i = 0; i < sessionStorage.length; i++) {
        if ((sessionStorage.key(i).endsWith("cb")) == true) {
            sessionStorage.removeItem(sessionStorage.key(i));
        }
    }
}

function hideAllAddons() {
    var zones = ["US", "Zone1", "Zone2", "Zone3", "Zone4"];

    // console.log(zones);
    for (i = 0; i < zones.length; i++) {
        // console.trace("Removing previously added Add-ons: " + zones[i]);
        document.getElementById(zones[i]).style.display = "none";
        document.getElementById(zones[i]).style.backgroundColor = "white";
        $("#" + zones[i]).empty();
    }
    clearChecksinSS();
    document.getElementById("submit-container").style.display = "none";
}

function displayRelAdd(zone) {
    hideAllAddons();
    document.getElementById(zone).style.display = "flex";
    document.getElementById(zone).style.backgroundColor = "#FFA726";
    loadData(zone);
    document.querySelector("#submit-container").style.display = "flex";
    /* ISSUE: Switches were appearing as normal checkbox*/
    setTimeout(function () {
        componentHandler.upgradeAllRegistered();
    }, 200);

}

function confirm(evt) {
    countCheckboxes(evt);
    formValues();
    notify();
}

//Display all form values in Console
function formValues() {
    console.trace("Printing Form Values");
    for (i = 0; i < document.travel.elements.length; i++) {
        if (document.travel[i].type === "checkbox") {
            console.warn(document.travel[i].name + ": " + document.travel[i].checked);
            sessionStorage.setItem(document.travel[i].name, document.travel[i].checked);
        }
        else if ((document.travel[i].type === "text") || (document.travel[i].type === "tel") || (document.travel[i].type === "email")) {
            console.info(document.travel[i].name + " : " + document.travel[i].value);
            sessionStorage.setItem(document.travel[i].name, document.travel[i].value)
        }
    }
    console.trace("All Values printed");
}

function countCheckboxes() {
    checked = $("input[type=checkbox]:checked").length;

    if (checked < 2) {
        alert("Please select atleast one Travel add-on.");
        console.warn("Please select atleast one Travel add-on.");
        event.preventDefault();
        return false;
    }
}

function loadData(zone) {
    $.getJSON("data/" + zone + "Plans.json")
        .done(function (d) {
            $.each(d, function (index, value) {

                var strippedName = index.replace(/_/g, ' ');
                $("#" + zone).append('<div class="form-card mdl-card mdl-shadow--16dp round">' +
                    '<div class="mdl-card__title">' +
                    '<h2 class="mdl-card__title-text">' + strippedName + '</h2>' +
                    '</div>' +
                    '<ul class="mdl-list" id="' + index + '">');
                var i = 0;
                for (key in value.detail) {
                    $("#" + index).append('<li class="mdl-list__item">' +
                        '<span class="mdl-list__item-primary-content">' +
                        '<i class="material-icons mdl-list__item-icon">' + value.detail[i].type + '</i>' +
                        value.detail[i].line +
                        '</span>' +
                        '</li>');
                    i++;

                }

                var j = 0;
                for (key in value.tag) {
                    $("#" + index).parent().addClass(value.tag[j].category);
                    j++;
                }

                $("#" + index).append('</ul>');
                if (index === 'Pay_as_You_Go') {
                    $('<div class="mdl-card__actions mdl-card--border">' +
                        '<label class="mdl-switch mdl-js-switch mdl-js-ripple-effect switch-right" for="' + index + 'cb">' +
                        '<input type="checkbox" id="' + index + 'cb" name="' + index + 'cb" class="mdl-switch__input" disabled>' +
                        '<span class="mdl-switch__label"></span>' +
                        '</label>' +
                        '<div class="mdl-tooltip mdl-tooltip--large" for="' + index + 'cb">Add this Package</div>' +
                        '</div>' +
                        '</div>').insertAfter("#" + index);
                }
                else if ((value.recommended).toUpperCase() == 'YES') {
                    $('<div class="mdl-card__actions mdl-card--border">' +
                        '<label class="mdl-switch mdl-js-switch mdl-js-ripple-effect switch-right" for="' + index + 'cb">' +
                        '<input type="checkbox" id="' + index + 'cb" name="' + index + 'cb" class="mdl-switch__input" checked>' +
                        '<span class="mdl-switch__label"></span>' +
                        '</label>' +
                        '<div class="mdl-tooltip mdl-tooltip--large" for="' + index + 'cb">Add this Package</div>' +
                        '</div>' +
                        '</div>').insertAfter("#" + index);
                }
                else {
                    $('<div class="mdl-card__actions mdl-card--border">' +
                        '<label class="mdl-switch mdl-js-switch mdl-js-ripple-effect switch-right" for="' + index + 'cb">' +
                        '<input type="checkbox" id="' + index + 'cb" name="' + index + 'cb" class="mdl-switch__input">' +
                        '<span class="mdl-switch__label"></span>' +
                        '</label>' +
                        '<div class="mdl-tooltip mdl-tooltip--large" for="' + index + 'cb">Add this Package</div>' +
                        '</div>' +
                        '</div>').insertAfter("#" + index);
                }
            });
        })
        .fail(function (jqxhr, textStatus, error) {
            var err = textStatus + ", " + error;
            console.log("Request Failed to the Database: " + err);
        });
}

function loadValuesinDropDown() {
    $.getJSON("data/countries.json")
        .done(function (d) {
            $.each(d, function (index, value) {
                var i = 0;
                for (key in value) {
                    $("#countryNames").append('<option value="' + value[i].country + '">');
                    i++;
                }
            });
        })
        .fail(function (jqxhr, textStatus, error) {
            var err = textStatus + ", " + error;
            console.log("Request Failed to the Database Countries: " + err);
        });
    if (document.travel.country.value != null) {
        searchThrough(document.travel.country.value);
    }

    addIDtoDateField();
    optimizeDate();
    notificationPermission();
    introduce();
    fillForm();
}

function addIDtoDateField() {
    $("#depart_date").next().attr('id', 'departure_date').attr('name', 'departure_date');
    $("#return_date").next().attr('id', 'returning_date').attr('name', 'returning_date');
}

function optimizeDate() {
    var depart_date = flatpickr("#departure_date", {minDate: new Date()});
    var return_date = flatpickr("#returning_date", {minDate: new Date()});

    depart_date.set("onChange", function (d) {
        return_date.set("minDate", d.fp_incr(2)); //increment by 2 day
    });
    return_date.set("onChange", function (d) {
        depart_date.set("maxDate", d);
    });
}

function notificationPermission() {
    Notification.requestPermission().then(function (result) {
        if (result === 'denied') {
            console.log('Permission wasn\'t granted. Allow a retry.');
            Notification.requestPermission();
            return;
        }
        else if (result === 'default') {
            console.log('The permission request was dismissed.');
            return;
        }
        else {
            console.log('Notification Permission Granted');
            return;
        }
    });
}


function introduce() {
    if (localStorage.getItem('firstTime') == 'false') {
    }
    else {
        introJs().start();
        localStorage.setItem("firstTime", "false");
    }
}

function filter(word) {
    var classes = word.split(/[\s,]+/);
    for (let value of classes) {
        document.querySelector('.' + value + '').style.display = "none";
    }
}


function fillForm(){
    $("#name").val(sessionStorage.getItem('name'));
    $("#email").val(sessionStorage.getItem('email'));
    $("#manemail").val(sessionStorage.getItem('manemail'));
    $("#departure_date").val(sessionStorage.getItem('departure_date'));
    $("#returning_date").val(sessionStorage.getItem('returning_date'));
    $("#phone").val(sessionStorage.getItem('phone'));
    $("#country").val(sessionStorage.getItem('country'));
    if (sessionStorage.getItem('terms') == 'true'){
        $("#terms").prop('checked', true);
    }
}
