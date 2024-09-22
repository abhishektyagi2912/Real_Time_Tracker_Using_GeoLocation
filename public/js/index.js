const socket = io();

if (navigator.geolocation) {
    navigator.geolocation.watchPosition((position) => {
        const { latitude, longitude } = position.coords;
        socket.emit('sendLocation', { latitude, longitude });
    }, (error) => {
        console.log(error);
    }, {
        enableHighAccuracy: true,
        timeout: 5000, 
        maximumAge: 0
    }
    );
}

const map = L.map('map').setView([0, 0], 50);   // Create a map centered at 0,0 with zoom level 10
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
    attribution:"Abhishek's map"
}).addTo(map);  // Add a tile layer to the map

const marker= {}

socket.on('receiveLocation', (data) => {
    const { id, latitude,longitude } = data;
    map.setView([latitude, longitude], 40);  // Set the view of the map to the received location
    if (!marker[id]) {
        marker[id] = L.marker([data.latitude, data.longitude]).addTo(map);
    } else {
        marker[id].setLatLng([data.latitude, data.longitude]);
    }
});  // Listen for the receiveLocation event

socket.on('user-disconnect', (data) => {
    if(marker[data.id]){
        map.removeLayer(marker[data.id]);
        delete marker[data.id];
    }
});  // Listen for the disconnect event