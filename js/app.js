

function init() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(successFunction, errorFunction);
    } else {
        alert('Tu navegador no soporta Geolocalización');
    }

};

function successFunction(position) {


    let arrayLatitud = [43.3797688361451, 43.380343335249556, 43.3805246345095, 43.38006456222384, 43.38059091582145];
    let arrayLongitud = [-3.2172797756807205, -3.2169249748311204, -3.217362174902788, -3.218856165308212, -3.218773016873821];
    
    muestraMapa(arrayLatitud, arrayLongitud);

    
};

function muestraMapa(arrayLat, arrayLong) {

    // Crear el mapa
    let map = new OpenLayers.Map("basicMap");
    let mapnik = new OpenLayers.Layer.OSM();
    let fromProjection = new OpenLayers.Projection("EPSG:4326");   // Transform from WGS 1984
    let toProjection = new OpenLayers.Projection("EPSG:900913");  // to Spherical Mercator Projection
    let zoom = 17;

    map.addLayer(mapnik);

    // Crear capa de marcadores
    let markers = new OpenLayers.Layer.Markers("Markers");
    map.addLayer(markers);

    // Agregar marcadores
    for (let i = 0; i < arrayLat.length; i++) {
        let position = new OpenLayers.LonLat(arrayLong[i], arrayLat[i]).transform(fromProjection, toProjection);
        let marker = new OpenLayers.Marker(position);

        markers.addMarker(marker);

        // Evento mouseover para mostrar el popup
        marker.events.register('mouseover', marker, function(evt) {
            mostrarPopup(evt, arrayLat[i], arrayLong[i], i);
        });

        // Evento mouseout para quitar el popup
        marker.events.register('mouseout', marker, function(evt) {
            quitarPopup();
        });
    }

    // Centrar el mapa en el primer marcador
    let centerPosition = new OpenLayers.LonLat(arrayLong[0], arrayLat[0]).transform(fromProjection, toProjection);
    map.setCenter(centerPosition, zoom);
}

let div;
let audio;

// Mostrar el popup
function mostrarPopup(evt, lat, longitud, iteracion) {
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


        audio = new Audio(`./js/audio/marza${iteracion+1}.mp3`);

        audio.play();

        

    }

    
}

// Quitar el popup
function quitarPopup() {
    if (div) {
        document.body.removeChild(div);
        div = null;


        audio.pause();
        audio.currentTime = 0;

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