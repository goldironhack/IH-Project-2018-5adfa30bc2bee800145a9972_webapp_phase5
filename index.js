var map;
var districts = new Array(71);
var anterior;
var hause, neight, crimes;
var air,schools, museum,art,mark,opend,tabulations,mapi,x;
var DATA = [];
var elli =1;
var Mark = [];
var Marke = [];
window.onload = function initMap() {
    var styledMapType = new google.maps.StyledMapType(
        [
            {
                elementType: "labels",
                stylers: [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                featureType: "administrative.land_parcel",
                stylers: [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                featureType: "administrative.neighborhood",
                stylers: [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                featureType: 'landscape',
                elementType: 'geometry',
                stylers: [
                    {
                        visibility: "simplified"
                    }
                ]
            },
            {
                featureType: "poi",
                elementType: "labels.text",
                stylers: [
                    {
                        visibility: "off"
                    }
                ]
            },
            {
                featureType: "poi.business",
                stylers: [
                    {
                        visibility: "off"
                    }
                ]
            },
            {
                featureType: "road",
                stylers: [
                    {
                        visibility: "simplified"
                    }
                ]
            },
            {
                featureType: "road",
                elementType: "labels",
                stylers: [
                    {
                        visibility: "off"
                    }
                ]
            },
            {
                featureType: "road",
                elementType: "labels.icon",
                stylers: [
                    {
                        visibility: "off"
                    }
                ]
            },
            {
                featureType: "road.arterial",
                elementType: "labels",
                stylers: [
                    {
                        visibility: "off"
                    }
                ]
            },
            {
                featureType: "road.highway",
                elementType: "labels",
                stylers: [
                    {
                        visibility: "off"
                    }
                ]
            },
            {
                featureType: "road.local",
                stylers: [
                    {
                        visibility: "off"
                    }
                ]
            },
            {
                featureType: "transit",
                stylers: [
                    {
                        visibility: "off"
                    }
                ]
            },
            {
                featureType: "water",
                stylers: [
                    {
                        color: "#b9d3c2"
                    }
                ]
            },
            {
                featureType: "water",
                elementType: "labels.text",
                stylers: [
                    {
                        visibility: "off"
                    }
                ]
            }
        ],
        {name: 'Styled Map'});


    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 40.7142700, lng: -74.0059700},
        zoom: 11,
        disableDefaultUI: true
    });

    addshapes();

    map.data.setStyle(function(feature){
        fillop = 0.1;
        strweigt = 0.7;
        if (feature.getProperty('click') && getDistrict(feature)<=20) {
            fillop = 0.3;
            strweigt = 2;
        }
        if (getDistrict(feature)>20) {
            fillop = 0.0001;
            strweigt = 0.0001;
        }


        return ({
            fillColor: getColor(feature),
            strokeColor: 'black',
            strokeWeight: strweigt,
            strokeOpacity: 1,
            fillOpacity: fillop,

        });
    });
    map.data.addListener('click', function(event) {
        if(anterior !== undefined){
            anterior.setProperty('click', false);
        }
        anterior = event.feature;
        event.feature.setProperty('click', true);

        showup(event.feature.getProperty('BoroCD'));
        dataCircle(event.feature.getProperty('BoroCD'));
        let a =  ComName(event.feature.getProperty('BoroCD'));
        document.getElementById("boro").innerHTML = a;

    });

    map.data.addListener('mouseover', function(event) {
        if (getDistrict(event.feature)<=20){

            map.data.overrideStyle(event.feature, {strokeWeight: 2});
            map.data.overrideStyle(event.feature, {fillOpacity: 0.3});
        }
    });

    map.data.addListener('mouseout', function(event) {
        map.data.revertStyle();
    });
    map.mapTypes.set('styled_map', styledMapType);
    map.setMapTypeId('styled_map');
    uni = new google.maps.LatLng(40.7290549, -73.9965233);

    marker = new google.maps.Marker({
        position: uni,
        map: map,
        title: 'NYU Stern School',
        icon: "https://icon-icons.com/icons2/510/PNG/32/university_icon-icons.com_49967.png"

    });
    loadGeneral();


    NY_neighborhood_fills = new google.maps.KmlLayer({
        url: 'https://data.cityofnewyork.us/api/geospatial/cpf4-rkhq?method=export&format=KML',
        map: map
    });


};

function ComName(Boro) {
    var a =getBoroughName(Math.trunc(Boro/100)) +" "+ String(Boro%100);
    return a;

}

function addshapes() {
    loadJSON("https://services5.arcgis.com/GfwWNkhOj9bNBqoJ/arcgis/rest/services/nycd/FeatureServer/0/query?where=1=1&outFields=*&outSR=4326&f=geojson", function ( data ){
        mapi = data;
        uni = new google.maps.LatLng(40.7290549, -73.9965233);
        x = map.data.addGeoJson(mapi);
        for (let i = 0; i < mapi.features.length; i++) {
            let lat = 0,lon = 0, n = 0;
            let minlat = 1000;
            let maxlat = -1000;
            let minlon = 1000;
            let maxlon = -1000;

            for (let j = 0; j < mapi.features[i].geometry.coordinates.length; j++) {
                for (let k = 0; k < mapi.features[i].geometry.coordinates[j].length; k++) {
                    //alert(JSON.stringify(mapi.features[i].geometry.coordinates[j][k]));
                    if(mapi.features[i].geometry.coordinates[j][k].length === 2){
                        n++;
                        lon = mapi.features[i].geometry.coordinates[j][k][0];
                        lat = mapi.features[i].geometry.coordinates[j][k][1];
                        if(lat < minlat){
                            minlat = lat;
                        } else if(lat > maxlat){
                            maxlat = lat;
                        }
                        if(lon < minlon){
                            minlon = lon;
                        } else if(lon > maxlon){
                            maxlon = lon;
                        }
                    }else {
                        for (let l = 0; l < mapi.features[i].geometry.coordinates[j][k].length; l++) {
                            n++;
                            lon = mapi.features[i].geometry.coordinates[j][k][l][0];
                            lat = mapi.features[i].geometry.coordinates[j][k][l][1];

                            if(lat < minlat){
                                minlat = lat;
                            } else if(lat > maxlat){
                                maxlat = lat;
                            }
                            if(lon < minlon){
                                minlon = lon;
                            } else if(lon > maxlon){
                                maxlon = lon;
                            }
                        }
                    }
                }
            }
            let distri = {};
            distri.boro = mapi.features[i].properties.BoroCD;
            DATA.push( distri );
            myLatLng = new google.maps.LatLng(minlat+(maxlat-minlat)/2,minlon + (maxlon-minlon)/2);
            DATA[i].center = myLatLng;
            DATA[i].shape = x[i];
            //DATA[i].distancE = Math.sqrt(((40.7290549-(minlat+(maxlat-minlat)/2))*(40.7290549-(minlat+(maxlat-minlat)/2)))+((-73.9965233-(minlon + (maxlon-minlon)/2))*(-73.9965233-(minlon + (maxlon-minlon)/2))));
            DATA[i].distancE = google.maps.geometry.spherical.computeDistanceBetween( uni, myLatLng)/1000;
            getCrimes(i);
            getHausing(i);
            getArt(i);
            getMus(i);

            //alert( JSON.stringify(DATA[i].distancE));
        }
        //alert( JSON.stringify(DATA[0].crimes));
    });
}

function getCrimes(index) {
    loadJSON("https://data.cityofnewyork.us/resource/9s4h-37hy.json?cmplnt_fr_dt=2015-12-31T00:00:00.000",
        function ( data ) {
            crimes = data;
            var arr2 = [];
            for (let i = 0; i < crimes.length; i++) {
                let arr = [];
                if(crimes[i].boro_nm === getBoroughName(getBorough(DATA[index].shape))){
                    if ("latitude" in crimes[i] && "longitude" in crimes[i]) {
                        myLatLng = new google.maps.LatLng(crimes[i].latitude, crimes[i].longitude);
                        if(contains(myLatLng,DATA[index].shape)){
                            arr.push(crimes[i].prem_typ_desc);
                            arr.push(crimes[i].ofns_desc);
                            arr.push(myLatLng);
                            arr2.push(arr);
                        }
                    }
                }
            }
            DATA[index].crimes = arr2;
        });
}

function getHausing(index) {
    loadJSON("https://data.cityofnewyork.us/api/views/hg8x-zxpr/rows.json",
        function ( data ){
            var r2= [];
            hause = data;
            let unit = 0;
            for (var i = 0; i < hause.data.length; i++) {
                var ar = [];
                if (hause.data[i][9] !== "CONFIDENTIAL") {
                    myLatLng = new google.maps.LatLng(hause.data[i][23], hause.data[i][24]);
                    let xx = String(DATA[index].boro % 100);
                    if(DATA[index].boro % 100 < 10){
                        xx = "0" + xx;
                    }
                    if(hause.data[i][19].substring(3) === xx && hause.data[i][15].toUpperCase() === getBoroughName(getBorough(DATA[index].shape))){
                        ar.push(hause.data[i][1]);
                        ar.push(hause.data[i][47]);
                        ar.push(myLatLng);
                        r2.push(ar);
                        unit += parseInt(hause.data[i][47]);
                    }
                }
            }
            //alert(JSON.stringify(r2));
            DATA[index].haus = r2;
            DATA[index].units = unit;
        });
}

function getArt(index) {
    loadJSON("https://data.cityofnewyork.us/api/views/fn6f-htvy/rows.json",
        function ( data ){
            var r2= [];
            art = data;
            for (var i = 0; i < art.data.length; i++) {
                var ar = [];

                let a = art.data[i][8].toString();
                let x = a.split(" ");
                var la = x[1].substring(1);
                var lo = x[2].substring(0,x[2].length-1);
                myLatLng = new google.maps.LatLng(lo, la);
                if(contains(myLatLng,DATA[index].shape)){
                    ar.push(art.data[i][9]);
                    ar.push(art.data[i][11]);
                    ar.push(myLatLng);
                    r2.push(ar);
                }
            }
            //alert(JSON.stringify(r2));
            DATA[index].artg = r2;
        });
}

function getMus(index) {
    loadJSON("https://data.cityofnewyork.us/api/views/43hw-uvdj/rows.json",
        function ( data ){
            var r2= [];
            art = data;
            for (var i = 0; i < art.data.length; i++) {
                var ar = [];

                let a = art.data[i][9].toString();
                let x = a.split(" ");
                var la = x[1].substring(1);
                var lo = x[2].substring(0,x[2].length-1);
                myLatLng = new google.maps.LatLng(lo, la);
                if(contains(myLatLng,DATA[index].shape)){
                    ar.push(art.data[i][8]);
                    ar.push(myLatLng);
                    ar.push(String(art.data[i][11]));
                    r2.push(ar);
                }
            }
            //alert(JSON.stringify(r2));
            DATA[index].mus = r2;
        });
}


var arr5;
function showup(Boro) {
    let j=0;
    for (let i = 0; i < DATA.length; i++) {
        if(DATA[i].boro === Boro){
            j=i;
            break;
        }
    }
    var color = "white";
    if(elli === 1 ){
        color = "#721c24";
        arr5 = DATA[j].crimes;
    }else if(elli === 2){
        color = "#466CA6";
        arr5 = DATA[j].haus;
    }else if(elli === 3){
        color = "#D1AFF5";
        arr5 = DATA[j].artg;
    }else {
        color = "#1AAA23";
        arr5 = DATA[j].mus;
    }
    //alert(JSON.stringify(arr5));
    d3.select("#viz")
        .selectAll("table")
        .remove();

    d3.select("#viz")
        .append("table")
        .attr("id","tabla")
        .style("border-collapse", "collapse")
        .style("border", "2px black solid")
        .style("background-color","white")

        .selectAll("tr")
        .data(arr5)
        .enter().append("tr")
        .on("mouseover", function(){d3.select(this).style("background-color", color)})
        .on("mouseout", function(){d3.select(this).style("background-color", "white")})

        .selectAll("td")
        .data(function(d){return d;})
        .enter().append("td")
        .style("border", "1px black solid")
        .style("padding", "10px")
        .text(function(d){return d;})
        .style("font-size", "12px");
}

var arr6 =[["#","Borough","District","#Income Hause","center"]];

sortByHausDo = false;
function sortByHaus() {
    DATA.sort(function (a, b) {
        return(b.units - a.units)
    });
    let i = 0,numb=0;
    let f = 10;
    if(!sortByHausDo){
        while (i<f){
            if((DATA[i].boro)%100<20){
                numb++;
                aux = [];
                aux.push(numb);
                aux.push(getBoroughName(Math.trunc(DATA[i].boro/100)));
                aux.push(DATA[i].boro%100);
                aux.push(DATA[i].units);
                aux.push(DATA[i].center);
                arr6.push(aux);
            }else {
                f++;
            }
            i++;
        }
    }

    for (let j = 0; j < Mark.length; j++) {
        Mark[j].setMap(null);
    }

    for (let j = 1; j < 11; j++) {
        var marker = new google.maps.Marker({
            position: arr6[j][4],
            map: map,
            label: String(j)
        });
        Mark.push(marker);
    }

    sortByHausDo = true;

    //alert( JSON.stringify(arr3));
    d3.select("#viz")
        .selectAll("table")
        .remove();

    d3.select("#viz")
        .append("table")
        .style("border-collapse", "collapse")
        .style("border", "2px black solid")
        .style("background-color","white")

        .selectAll("tr")
        .data(arr6)
        .enter().append("tr")
        .on("mouseover", function(){d3.select(this).style("background-color", "#466CA6")})
        .on("mouseout", function(){d3.select(this).style("background-color", "white")})

        .selectAll("td")
        .data(function(d){return d;})
        .enter().append("td")
        .style("border", "1px black solid")
        .style("padding", "10px")
        .text(function(d){return d;})
        .style("font-size", "12px");


}

var arr4 =[["#","Borough","District","Distance","center"]];
sortByDistanceDo = false;
function sortByDistance() {
    DATA.sort(function (a, b) {
        return (a.distancE - b.distancE)
    });
    let i = 0, numb = 0;
    let f = 10;
    if(!sortByDistanceDo){
        while (i < f) {
            if ((DATA[i].boro) % 100 < 20) {
                numb++;
                aux = [];
                aux.push(numb);
                aux.push(getBoroughName(Math.trunc(DATA[i].boro / 100)));
                aux.push(DATA[i].boro % 100);
                aux.push(DATA[i].distancE);
                aux.push(DATA[i].center);
                arr4.push(aux);
            } else {
                f++;
            }
            i++;
        }
        sortByDistanceDo = true;
    }

    for (let j = 0; j < Mark.length; j++) {
        Mark[j].setMap(null);
    }

    for (let j = 1; j < 11; j++) {
        var marker = new google.maps.Marker({
            position: arr4[j][4],
            map: map,
            label: String(j)
        });
        Mark.push(marker);

    }


    //alert(JSON.stringify(arr4));
    d3.select("#viz")
        .selectAll("table")
        .remove();

    d3.select("#viz")
        .append("table")
        .style("border-collapse", "collapse")
        .style("border", "2px black solid")
        .style("background-color","white")

        .selectAll("tr")
        .data(arr4)
        .enter().append("tr")
        .on("mouseover", function(){d3.select(this).style("background-color", "#D1AE45")})
        .on("mouseout", function(){d3.select(this).style("background-color", "white")})

        .selectAll("td")
        .data(function(d){return d;})
        .enter().append("td")
        .style("border", "1px black solid")
        .style("padding", "10px")
        .text(function(d){return d;})
        .style("font-size", "12px");
}

var top0 =[["#","Borough","District"]];
top0.push(["1","MANHATTAN", "6"]);
top0.push(["2","MANHATTAN", "4"]);
top0.push(["3","QUEENS", "2"]);

function Top3() {
    let a,b,c;

    clearMap();

    //alert( JSON.stringify(arr3));
    d3.select("#viz")
        .selectAll("table")
        .remove();

    d3.select("#viz")
        .append("table")
        .style("border-collapse", "collapse")
        .style("border", "2px black solid")
        .style("background-color",'white')

        .selectAll("tr")
        .data(top0)
        .enter().append("tr")
        .on("mouseover", function(){d3.select(this).style("background-color", "#717225")})
        .on("mouseout", function(){d3.select(this).style("background-color", "white")})

        .selectAll("td")
        .data(function(d){return d;})
        .enter().append("td")
        .style("border", "1px black solid")
        .style("padding", "10px")
        .text(function(d){return d;})
        .style("font-size", "20px");


}


var arr3 =[["#","Borough","District","#Crimes","center"]];
sortByCrimesDo = false;


function sortByCrimes() {
    DATA.sort(function (a, b) {
        return(a.crimes.length - b.crimes.length)
    });
    let i = 0,numb=0;
    let f = 10;
    if(!sortByCrimesDo){
        while (i<f){
            if((DATA[i].boro)%100<20){
                numb++;
                aux = [];
                aux.push(numb);
                aux.push(getBoroughName(Math.trunc(DATA[i].boro/100)));
                aux.push(DATA[i].boro%100);
                aux.push(DATA[i].crimes.length);
                aux.push(DATA[i].center);
                arr3.push(aux);
            }else {
                f++;
            }
            i++;
        }
    }
    sortByCrimesDo = true;

    clearMap();

    for (let j = 1; j < 11; j++) {
        var marker = new google.maps.Marker({
            position: arr3[j][4],
            map: map,
            label: String(j)
        });
        Mark.push(marker);
    }


    //alert( JSON.stringify(arr3));
    d3.select("#viz")
        .selectAll("table")
        .remove();

    d3.select("#viz")
        .append("table")
        .style("border-collapse", "collapse")
        .style("border", "2px black solid")
        .style("background-color",'white')

        .selectAll("tr")
        .data(arr3)
        .enter().append("tr")
        .on("mouseover", function(){d3.select(this).style("background-color", "#721c24")})
        .on("mouseout", function(){d3.select(this).style("background-color", "white")})

        .selectAll("td")
        .data(function(d){return d;})
        .enter().append("td")
        .style("border", "1px black solid")
        .style("padding", "10px")
        .text(function(d){return d;})
        .style("font-size", "12px");

}

function contains(point, shape) {

    if(shape.getGeometry().b[0].b[0].b === undefined) {
        for (let i = 0; i < shape.getGeometry().b.length ; i++) {
            if ( google.maps.geometry.poly.containsLocation( point , new google.maps.Polygon({ paths: shape.getGeometry().b[i].b , }) ) ) {
                return true;
            }
        }
    } else {
        for (let i = 0; i < shape.getGeometry().b.length ; i++) {
            for (let j = 0; j < shape.getGeometry().b[i].b.length ; j++) {
                if ( google.maps.geometry.poly.containsLocation( point , new google.maps.Polygon({ paths: shape.getGeometry().b[i].b[j].b }) ) ) {
                    return true;
                }
            }
        }
    }
    return false;
}

function getDistrict(feature){
    return feature.getProperty('BoroCD')%100;
}

function getBorough(feature){
    return Math.trunc(feature.getProperty('BoroCD')/100);
}

function getBoroughName(index) {
    switch (index){
        case 1:
            return "MANHATTAN";
        case 2:
            return "BRONX";
        case 3:
            return "BROOKLYN";
        case 4:
            return "QUEENS";
        case 5:
            return "STATEN ISLAND";
    }
}

function getColor (feature) {
    var boro = getBorough(feature);
    var district = getDistrict(feature);
    if(district > 20 ){
        return 'white';
    }
    switch ( boro ){
        case 1:
            return '#6fd6ff';
        case 2:
            return '#1710ba';
        case 3:
            return '#f2dc15';
        case 4:
            return '#d90013';
        case 5:
            return '#610d27';
    }
}


function  load(){
    loadJSON("https://data.cityofnewyork.us/api/views/hg8x-zxpr/rows.json",
    function ( data ){
        LoadHausingt();
        clearMap();
        hause = data;
        var markers = [];
        for (var i = 0; i < hause.data.length; i++) {
            if (hause.data[i][9] !== "CONFIDENTIAL") {

                myLatLng = new google.maps.LatLng(hause.data[i][23], hause.data[i][24]);

                var marker = new google.maps.Marker({
                    position: myLatLng,
                    icon: "https://i.imgur.com/WU2b38o.png",
                        //title: 'Hi',
                });
                markers.push(marker);
                Mark.push(marker);
            }
        }
        var markerCluster = new MarkerClusterer(map, markers,
            {
                imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m',
                minimumClusterSize: 4,
            });
        Marke.push(markerCluster);
    });

}

function  load2(){
    loadJSON("https://data.cityofnewyork.us/api/views/xyye-rtrs/rows.json",
    function ( data ){
        clearMap();
        neight = data;
        var markers = [];
        for (let i = 0; i < neight.data.length; i++) {
            let a = neight.data[i][9].toString();
            let x = a.split(" ");
            var la = x[1].substring(1);
            var lo = x[2].substring(0,x[2].length-1);
            myLatLng = new google.maps.LatLng(lo, la);
            //alert(JSON.stringify( myLatLng ));
            var image = {
                url: "https://i.imgur.com/l9yF5Vt.png",
                size: new google.maps.Size(64, 64),
            }
            var marker = new google.maps.Marker({
                position: myLatLng,
                //icon: image,
                icon: image,
                //map: map,
                label:neight.data[i][10]
            });
            markers.push(marker);
            Mark.push(marker);
        }
        var markerCluster = new MarkerClusterer(map, markers,
            {
                imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m',
                minimumClusterSize: 2,
            });
        Marke.push(markerCluster);
    });
}

function  loadCrimes(){
    clearMap();
    LoadCrimest();
    var markers = [];
    for (let i = 0; i < DATA.length; i++) {
        for (let j = 0; j < DATA[i].crimes.length; j++) {
            var marker = new google.maps.Marker({
                position: DATA[i].crimes[j][2],
                icon: "https://i.imgur.com/gSFaKds.png",
                //map: map,
            });
            markers.push(marker);
        }
    }
    var markerCluster = new MarkerClusterer(map, markers,
        {
            imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m',
            minimumClusterSize: 2,
        });
    Marke.push(markerCluster);
}

function loadMuss() {
    clearMap();
    LoadMusseums();
    var markers = [];
    for (let i = 0; i < DATA.length; i++) {
        for (let j = 0; j < DATA[i].artg.length; j++) {
            var marker = new google.maps.Marker({
                position: DATA[i].artg[j][2],
                icon: "https://i.imgur.com/ZAP2XkL.png",
                //map: map,
            });
            markers.push(marker);
        }
    }
    var markerCluster = new MarkerClusterer(map, markers,
        {
            imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m',
            minimumClusterSize: 2,
        });
    Marke.push(markerCluster);

}

function loadArt() {
    clearMap();
    LoadArt();
    var markers = [];
    for (let i = 0; i < DATA.length; i++) {
        for (let j = 0; j < DATA[i].mus.length; j++) {
            var marker = new google.maps.Marker({
                position: DATA[i].mus[j][1],
                icon: "https://i.imgur.com/zfPitc3.png",
                //map: map,
            });
            markers.push(marker);
        }
    }
    var markerCluster = new MarkerClusterer(map, markers,
        {
            imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m',
            minimumClusterSize: 2,
        });
    Marke.push(markerCluster);

}

function clearMap() {

    for (let i = 0; i < Mark.length; i++) {
        Mark[i].setMap(null);
    }
    for (let i = 0; i < Marke.length; i++) {
        Marke[i].clearMarkers();
    }

}


function loadGeneral() {
    loadJSON("https://data.cityofnewyork.us/api/views/c3uy-2p5r/rows.json", function ( data ){ air = data; });

    loadJSON("https://data.cityofnewyork.us/api/views/xzy8-qqgf/rows.json", function ( data ){ schools= data; });

    loadJSON("https://data.cityofnewyork.us/api/views/fn6f-htvy/rows.json", function ( data ){ museum = data});

    loadJSON("https://data.cityofnewyork.us/api/views/43hw-uvdj/rows.json", function ( data ){ art= data});

    loadJSON("https://data.cityofnewyork.us/api/views/j8gx-kc43/rows.json", function ( data ){ mark = data; });

    loadJSON("https://data.ny.gov/api/views/vfrh-bvhu/rows.json", function ( data ){ opend = data; });

    loadJSON("https://data.cityofnewyork.us/api/views/q2z5-ai38/rows.json", function ( data ){ tabulations = data; });
}

function loadJSON(path, success) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                success(JSON.parse(xhr.responseText));
            }
            else {
                alert("error: "+xhr.status);
            }
        }
    };
    xhr.open('GET', path, true);
    xhr.send();
}
//d3.js

var arra = [["id","Borough","district","score"]];
var LhauseT = false;
function LoadHausingt() {

    loadJSON("https://data.cityofnewyork.us/api/views/hg8x-zxpr/rows.json",
        function ( data ){
            hause = data;
            if(!LhauseT){
                for (var i = 0; i < hause.data.length; i++) {
                    var ar = [];
                    if (hause.data[i][9] !== "CONFIDENTIAL") {
                        myLatLng = new google.maps.LatLng(hause.data[i][23], hause.data[i][24]);
                        ar.push(hause.data[i][1]);
                        ar.push(hause.data[i][15]);
                        ar.push(hause.data[i][19].substring(3));
                        ar.push(hause.data[i][16]);
                        arra.push(ar);
                    }
                }
            }
            LhauseT = true;
            d3.select("#viz")
                .selectAll("table")
                .remove();

            d3.select("#viz")
            .append("table")
            .style("border-collapse", "collapse")
            .style("border", "2px black solid")
            .style("background-color","white")

            .selectAll("tr")
            .data(arra)
            .enter().append("tr")
            .on("mouseover", function(){d3.select(this).style("background-color", "#466CA6")})
            .on("mouseout", function(){d3.select(this).style("background-color", "white")})

            .selectAll("td")
            .data(function(d){return d;})
            .enter().append("td")
            .style("border", "1px black solid")
            .style("padding", "10px")
            .text(function(d){return d;})
            .style("font-size", "12px");
        });

}

var arra2 = [["place","Borough","description","latitude","longitude"]];
var LcrimesT = false;
function LoadCrimest() {

    loadJSON("https://data.cityofnewyork.us/resource/9s4h-37hy.json?cmplnt_fr_dt=2015-12-31T00:00:00.000",
        function ( data ){
            crimes = data;
            if(!LcrimesT){

                for (let i = 0; i < crimes.length; i++) {
                    var ar = [];
                    if ("latitude" in crimes[i] && "longitude" in crimes[i]) {
                        ar.push(crimes[i].prem_typ_desc);
                        ar.push(crimes[i].boro_nm);
                        ar.push(crimes[i].ofns_desc);
                        ar.push(crimes[i].latitude);
                        ar.push(crimes[i].longitude);
                        arra2.push(ar);
                    }
                }
            }
            LcrimesT = true;

            d3.select("#viz")
                .selectAll("table")
                .remove();

            d3.select("#viz")
                .append("table")
                .style("border-collapse", "collapse")
                .style("border", "2px black solid")
                .style("background-color","white")

                .selectAll("tr")
                .data(arra2)
                .enter().append("tr")
                .on("mouseover", function(){d3.select(this).style("background-color", "#721c24")})
                .on("mouseout", function(){d3.select(this).style("background-color", "white")})

                .selectAll("td")
                .data(function(d){return d;})
                .enter().append("td")
                .style("border", "1px black solid")
                .style("padding", "10px")
                .text(function(d){return d;})
                .style("font-size", "12px");
        });

}

var arraMus = [["id","coordinates","name","telephone","street","web"]];
var LmusT = false;
function LoadMusseums() {

    loadJSON("https://data.cityofnewyork.us/api/views/fn6f-htvy/rows.json",
        function ( data ){
            var museu = data;
            if(!LmusT){
                for (let i = 0; i < museu.data.length; i++) {
                    var ar = [];
                    ar.push(museu.data[i][0]);
                    ar.push(museu.data[i][8]);
                    ar.push(museu.data[i][9]);
                    ar.push(museu.data[i][10]);
                    ar.push(museu.data[i][12]);
                    ar.push(museu.data[i][11]);
                    arraMus.push(ar);
                }
            }

            LmusT = true;

            d3.select("#viz")
                .selectAll("table")
                .remove();

            d3.select("#viz")
                .append("table")
                .style("border-collapse", "collapse")
                .style("border", "2px black solid")
                .style("background-color","white")

                .selectAll("tr")
                .data(arraMus)
                .enter().append("tr")
                .on("mouseover", function(){d3.select(this).style("background-color", "#D1AFF5")})
                .on("mouseout", function(){d3.select(this).style("background-color", "white")})

                .selectAll("td")
                .data(function(d){return d;})
                .enter().append("td")
                .style("border", "1px black solid")
                .style("padding", "10px")
                .text(function(d){return d;})
                .style("font-size", "12px");
        });
}


var arraart = [["name","coordinates","telephone","street","web"]];
var LartT = false;
function LoadArt() {

    loadJSON("https://data.cityofnewyork.us/api/views/43hw-uvdj/rows.json",
        function ( data ){
            var art = data;
            if(!LartT){
                for (let i = 0; i < art.data.length; i++) {
                    var ar = [];
                    ar.push(art.data[i][8]);
                    ar.push(art.data[i][9]);
                    ar.push(art.data[i][10]);
                    ar.push(art.data[i][12]);
                    ar.push(art.data[i][11]);
                    arraart.push(ar);
                }
            }

            LartT = true;

            d3.select("#viz")
                .selectAll("table")
                .remove();

            d3.select("#viz")
                .append("table")
                .style("border-collapse", "collapse")
                .style("border", "2px black solid")
                .style("background-color","white")

                .selectAll("tr")
                .data(arraart)
                .enter().append("tr")
                .on("mouseover", function(){d3.select(this).style("background-color", "#1AAA23")})
                .on("mouseout", function(){d3.select(this).style("background-color", "white")})

                .selectAll("td")
                .data(function(d){return d;})
                .enter().append("td")
                .style("border", "1px black solid")
                .style("padding", "10px")
                .text(function(d){return d;})
                .style("font-size", "12px");
        });
}


function dataCircle(Boro) {

    let j=0;
    for (let i = 0; i < DATA.length; i++) {
        if(DATA[i].boro === Boro){
            j=i;
            break;
        }
    }
    var width = 200;

    var height = 400;

    let HL = DATA[j].haus.length;

    if(HL > 100){
        HL = 100;

    }else if(HL < 10){
        HL = 10;
    }

    let ML = DATA[j].mus.length;

    if(ML > 100){
        ML = 100;

    }else if(ML < 10){
        ML = 10;
    }

    var data = [DATA[j].crimes.length, HL*0.5, DATA[j].distancE*1.5,DATA[j].artg.length*2+5,ML*0.5];

    var colors =
        ['#721c24',
        '#466CA6',
        '#D1AE45',
        '#D1AFF5',
        '#1AAA23'];

    var titles =
        [DATA[j].crimes.length+" Crimes",
        DATA[j].haus.length+" Houses",
        DATA[j].distancE.toFixed(2)+" km",
        DATA[j].artg.length+" Museums",
        DATA[j].mus.length+" Galleries"];

    d3.select("#circle")
        .selectAll("svg")
        .remove();
    var svg = d3
        .select("#circle")
        .append("svg")
        .attr("width", width)
        .attr("height", height);


    var g = svg.selectAll("g")
        .data(data)
        .enter()
        .append("g")
        .attr("transform", function(d, i) {
            return "translate(0,0)";
        });

    g.append("circle")
        .attr("cx", function(d, i) {
            return 70;
        })

        .attr("cy", function(d, i) {
            return i*75+50;
        })

        .attr("r", function(d) {
            return d*0.8;
        })

        .on("mouseover", function(d,i){
            d3.select(this).style("fill-opacity", 1.5)
        })
        .on("mouseout", function(d,i){
            d3.select(this).style("fill-opacity", 0.8)
        })

        .on("click", function(d,i){
            markers(j,i);
            showup(Boro);
        })

        .attr("fill-opacity", function(d, i){
            return 0.8;
        })


        .attr("fill", function(d, i){
            return colors[i];
        });

    g.append("text")
        .attr("y", function(d, i) {
            return i * 75 + 55;
        })
        .attr("x", 120)
        .attr("font-size", "15px")
        .text(function(d, i) {
            return titles[i];
        });
}


function markers(Boro,i) {
    clearMap();
    if(i === 0){
        elli=1;
        for (let j = 0; j < DATA[Boro].crimes.length; j++) {
            var marker = new google.maps.Marker({
                position: DATA[Boro].crimes[j][2],
                map: map,
                icon: "https://i.imgur.com/gSFaKds.png"
            });
            Mark.push(marker);
        }
    }else if(i === 1){
        elli = 2;

        for (let j = 0; j < DATA[Boro].haus.length; j++) {
            var marker = new google.maps.Marker({
                position: DATA[Boro].haus[j][2],
                map: map,
                icon: "https://i.imgur.com/WU2b38o.png"
            });
            Mark.push(marker);
        }
    }else if (i === 3) {
        elli = 3;
        for (let j = 0; j < DATA[Boro].artg.length; j++) {
            var marker = new google.maps.Marker({
                position: DATA[Boro].artg[j][2],
                map: map,
                icon: "https://i.imgur.com/ZAP2XkL.png"
            });
            Mark.push(marker);
        }
    }else if (i === 4) {
        elli = 4;
        for (let j = 0; j < DATA[Boro].mus.length; j++) {
            var marker = new google.maps.Marker({
                position: DATA[Boro].mus[j][1],
                map: map,
                icon: "https://i.imgur.com/zfPitc3.png"
            });
            Mark.push(marker);
        }
    }
}

function download(csv) {
    var csvFile;
    var downloadLink;
    csvFile = new Blob([csv], {type: "text/csv"});
    downloadLink = document.createElement("a");
    downloadLink.download = "table.csv";
    downloadLink.href = window.URL.createObjectURL(csvFile);
    downloadLink.style.display = "none";
    document.body.appendChild(downloadLink);
    downloadLink.click();
}

function CvsCon() {
    var csv = [];
    var rows = document.querySelectorAll("table tr");

    for (var i = 0; i < rows.length; i++) {
        var row = [], cols = rows[i].querySelectorAll("td, th");

        for (var j = 0; j < cols.length; j++)
            row.push(cols[j].innerText);

        csv.push(row.join(","));
    }
    download(csv.join("\n"));
}

function cvs() {
    let cE;
    let save;
    let cont = "";
    for (let i = 0; i < DATA.length; i++) {
        if (i === 0)
            cont += Object.keys(DATA[i]).join(";") + "\n";
        cont += Object.keys(DATA[i]).map(function(key){
            return DATA[i][key];
        }).join(";") + "\n";
    }
    let blob;
    blob = new Blob(["\ufeff", cont], {type: 'text/csv'});
    let r;
    r = new FileReader();
    r.onload = function (event) {
        save = document.createElement('a');
        /** @namespace event.target.result */
        save.href = event.target.result;
        save.target = '_blank';
        save.download = "ALLDATA.csv";
        cE = new MouseEvent('click', {
            'view': window,
            'bubbles': true,
            'cancelable': true
        });
        save.dispatchEvent(cE);
        (window.URL || window.webkitURL).revokeObjectURL(save.href);
    }
    r.readAsDataURL(blob);}