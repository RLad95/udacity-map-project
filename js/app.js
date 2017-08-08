var fourSquareClientID = "SIW2QYEDP4W5AXYF5432EHN2LZCIDDZ1V3CBVBNULY02XHHZ";
var fourSquareClientSecret = "5VNCZGJ52AZLSMI15GA14USAUUY4PMLTVO0MSHNRALPACVE5";

// Places Model
var data = [
    {
        visit_place: "Ha Long Bay",
        location: {
            lat: 20.959651,
            lng: 107.04905889999998
        },
        visible: ko.observable(true),
        id: 0
	},
	{
        visit_place: "Phu Quoc",
        location: {
            lat: 10.289879,
            lng: 103.98401999999999
        },
        visible: ko.observable(true),
        id: 1
	},
	{
        visit_place: "Phong Nha",
        location: {
            lat: 17.5911277,
            lng: 106.28334689999997
        },
        visible: ko.observable(true),
        id: 2
	},
	{
        visit_place: "Hue",
        location: {
            lat: 16.4498,
            lng: 107.5623501
        },
        visible: ko.observable(true),
        id: 3
	},
	{
        visit_place: "Hoan Kiem",
        location: {
            lat: 21.0286669,
            lng: 105.85214840000003
        },
        visible: ko.observable(true),
        id: 4
	},
	{
        visit_place: "Museum of Cham Sculpture",
        location: {
            lat: 16.0607022,
            lng: 108.22344670000007
        },
        visible: ko.observable(true),
        id: 5
	},
	{
        visit_place: "Sa Pa",
        location: {
            lat: 22.2497168,
            lng: 103.9608091
        },
        visible: ko.observable(true),
        id: 6
    },
    {
        visit_place: "Hoi An",
        location: {
            lat:15.8800584,
            lng: 108.3380469
        },
        visible: ko.observable(true),
        id: 7
    },
    {
        visit_place: "My Son",
        location: {
            lat:15.7907204,
            lng: 108.10787099999993
        },
        visible: ko.observable(true),
        id: 8
    }
];

var markers = [];
var infoWindow = null;

// Init the map
function initMap() {

    // Center it to Vietnam
    var vietnam = {lat:16.4498, lng: 107.5623501};
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 6,
        center: vietnam
        });
    for (var i = 0; i < data.length; i++) {
        let location = data[i];
        let marker = new google.maps.Marker({
            position: location.location,
            animation: google.maps.Animation.DROP,
            map: map,
            id: location.id
        });


        marker.addListener('click', function() {
            marker.setAnimation(google.maps.Animation.BOUNCE);
            openInfoWindow(marker, location);
        });
        markers.push(marker);
    }
    infoWindow = new google.maps.InfoWindow();
}

// Open info window with foursuqare API
var openInfoWindow = function(marker, location) {
    if (infoWindow.marker != marker) {
        
        // build URL for the AJAX call
        var url = 'https://api.foursquare.com/v2/venues/search?' 
        url += 'client_id=';
        url += fourSquareClientID;
        url += '&client_secret=';
        url += fourSquareClientSecret;
        url += '&v=20130815&ll=';
        url += location.location.lat;
        url += ',';
        url += location.location.lng;
        url += '&query=restaurant';

        // AJAX call to get the nearby restaurants
        $.get(url, function(data, status){
            var venues = data.response.venues;
            var content = '<h4>' + location.visit_place + '</h4>' + '<p>Nearby Restaurants: </p>';
            content += '<ul>';
            for (var i = 0; i <= 5; i++) {
                content += '<li>';
                content += venues[i].name;
                content += '</li>';
            }
            content += '</ul>';
            infoWindow.marker = marker;
            infoWindow.setContent(content);
            infoWindow.open(map, marker);
            infoWindow.addListener('closeclick', function() {
                infoWindow.setMarker = null;
            });
            marker.setAnimation(null);
        }).fail(function() {
            alert('failed to fetch nearby restaurants');
            marker.setAnimation(null);
        });
	}
}


// animation of hamburger class on click
$('#hamburger-button').click(function() {
    if ($('#menu').position().left != -250) {
        $('#menu').animate({
            left: '-250px'
        });
        $('#app-wrapper').animate({
            left: '0',
            width: '100%'
        });
    } else {
        $('#menu').animate({
            left: '0'
        });
        $('#app-wrapper').animate({
            left: '250px',
            width: '-=250px'
        });
    }
});


// knockout model for binding events and data
function AppViewModel() {
    var self = this;

    self.places = ko.observableArray(data);

    this.filterInput = ko.observable('');
    this.handleFilter = ko.pureComputed(this.filterInput)
    
    // show the markers/location list based on the filter
    this.handleFilter.subscribe(function(filterInput) {
        var locations = self.places();
        locations.forEach(function(location) {
            if (location.visit_place.toLowerCase().indexOf(filterInput.toLowerCase()) === -1) {
                location.visible(false);
                markers[location.id].setMap(null);
            } else {
                location.visible(true);
                markers[location.id].setMap(map);
            }
        });
    });

    // open the info window when clicked on the sidebar
    this.onLocationClick = function(location) {
        let marker = markers[location.id];
        google.maps.event.trigger(marker, 'click')
    }
}

// Activates knockout.js
ko.applyBindings(new AppViewModel());

