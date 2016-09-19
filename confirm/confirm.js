/**
 * Created by prabh on 2016-06-21.
 */

function initMap() {
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 4,
        center: {lat: -34.397, lng: 150.644}
    });
    var geocoder = new google.maps.Geocoder();

    geocodeAddress(geocoder, map);
}

function geocodeAddress(geocoder, resultsMap) {
    var address = sessionStorage.getItem("country");
    geocoder.geocode({'address': address}, function (results, status) {
        if (status === google.maps.GeocoderStatus.OK) {
            resultsMap.setCenter(results[0].geometry.location);
            var marker = new google.maps.Marker({
                map: resultsMap,
                draggable: true,
                title: sessionStorage.getItem("country"),
                animation: google.maps.Animation.DROP,
                position: results[0].geometry.location
            });
            marker.addListener('click', function () {
                infowindow.open(map, marker);
            });
            var infowindow = new google.maps.InfoWindow({
                content: sessionStorage.getItem("country")
            });
        } else {
            alert('Geocode was not successful for the following reason: ' + status);
        }
    });
    loadData()
}

$(document).ready(function () {
    var dialog = document.querySelector('dialog');
    var showModalButton = document.querySelector('.show-modal');
    if (!dialog.showModal) {
        dialogPolyfill.registerDialog(dialog);
    }
    showModalButton.addEventListener('click', function () {
        sessionStorage.setItem("didClickEarlier", "true");

        if ($('.show-modal').attr("disabled") == "disabled") {
            return false;
        }
        else {
            notify();
            $(".show-modal").attr('disabled', true);
            $(".back").attr('disabled', true);
            $(".show-modal").attr('title', 'You have already submitted the form');
            dialog.showModal();
        }
    });
    dialog.querySelector('.close').addEventListener('click', function () {
        dialog.close();
    });
    dialog.querySelector('.it-page').addEventListener('click', function () {
        window.location.href = "http://it.sheridanc.on.ca/service-catalogue/technology-provisioning/about-roaming.html";
    });

});

function loadData() {
    if ((sessionStorage.getItem("didClickEarlier")) == 'true') {
        $(".show-modal").attr('disabled', true);
        $(".back").attr('disabled', true);
    }
    $("#name").append(sessionStorage.getItem("name"));
    $("#email").append(sessionStorage.getItem("email"));
    $("#manemail").append(sessionStorage.getItem("manemail"));

    $("#departure_date").append(sessionStorage.getItem("departure_date"));
    $("#returning_date").append(sessionStorage.getItem("returning_date"));
    $("#phone").append(sessionStorage.getItem("phone"));

    if (sessionStorage.length == 0) {
        console.log('User came to this page without inputting data. Send user back to main page');
        window.location.href = "../index.html";
    }

    $(".back").click(function () {
        if ($('.back').attr("disabled") == "disabled") {
            alert('You have already submitted the form! \n \n Please restart your browser to submit another submission')
        }
        else {
            for (var i = 0; i < sessionStorage.length; i++) {
                if ((sessionStorage.key(i).endsWith("cb")) == true) {
                    sessionStorage.removeItem(sessionStorage.key(i));
                }
            }
            window.history.back();
        }
    });


    for (var i = 0; i < sessionStorage.length; i++) {
        if ((sessionStorage.getItem(sessionStorage.key(i)) == 'true') && (sessionStorage.key(i)).endsWith("cb")) {
            var addon = sessionStorage.key(i).replace(/_/g, ' ').slice(0, sessionStorage.key(i).length - 2);
            $("#addons").append('<tr><td>' + addon + '</td></tr>')
        }
    }
}


function notify() {
    if (window.Notification && Notification.permission !== "denied") {
        Notification.requestPermission(function (status) {  // status is "granted", if accepted by user
            var n = new Notification('Thank You for making the request', {
                body: 'Travel Add-ons Request for ' + document.travel.name.value + '\n Country: ' + document.travel.country.value + '\n Phone: ' + document.travel.phone.value,
                icon: 'https://cdn1.iconfinder.com/data/icons/shopping-colored-icons-vol-1/128/P-1-61-512.png'
            });
        });
    }
    else {
        console.warn('Notifications are not supported by this browser: ' + navigator.userAgent);
    }
}