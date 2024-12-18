

function init() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(successFunction, errorFunction);
    } else {
        alert('Tu navegador no soporta Geolocalización');
    }

};

function successFunction(position) {
    let lat = position.coords.latitude;
    let longitud = position.coords.longitude;
    muestraMapa(lat, longitud);
    console.log(lat);
    console.log(longitud);
};

function muestraMapa(lat, longitud) {

    map = new OpenLayers.Map("basicMap");
    var mapnik = new OpenLayers.Layer.OSM();
    var fromProjection = new OpenLayers.Projection("EPSG:4326");   // Transform from WGS 1984
    var toProjection = new OpenLayers.Projection("EPSG:900913"); // to Spherical Mercator Projection
    var position = new OpenLayers.LonLat(longitud, lat).transform(fromProjection, toProjection);
    var zoom = 17;

    map.addLayer(mapnik);

    var markers = new OpenLayers.Layer.Markers("Markers");
    map.addLayer(markers);

    var marker = new OpenLayers.Marker(position);

    markers.addMarker(marker);

    map.setCenter(position, zoom);

    // Evento mouseover para mostrar el popup
    marker.events.register('mouseover', marker, function(evt) {
        mostrarPopup(evt, lat, longitud);
    });

    // Evento mouseout para quitar el popup
    marker.events.register('mouseout', marker, function(evt) {
        quitarPopup();
    });
}

let div;

// Mostrar el popup
function mostrarPopup(evt, lat, longitud) {
    if (!div) {
        div = document.createElement("div");
        div.style.top = "10px";
        div.style.left = "50%";
        div.style.position = "absolute";
        div.style.padding = "10px";
        div.style.backgroundColor = "white";
        div.style.border = "1px solid black";
        div.style.borderRadius = "5px";
        div.style.zIndex = "1000";

        // Añadir información al popup
        div.innerHTML = `Latitud: ${lat}<br>Longitud: ${longitud}`;

        document.body.appendChild(div);

    }

    
}

// Quitar el popup
function quitarPopup() {
    if (div) {
        document.body.removeChild(div);
        div = null;
    }
}

function errorFunction(position) {
    switch (position.code) {
        case position.PERMISSION_DENIED:
            alert("El usuario denego la petición de geolocalización.")
            break;
        case position.POSITION_UNAVAILABLE:
            alert("Información de localización no disponible.")
            break;
        case position.TIMEOUT:
            alert("La petición para obtener la ubicación del usuario expiró.")
            break;
        case position.UNKNOWN_ERROR:
            alert("Error desconocido.")
            break;
    }
};

window.onload= init;