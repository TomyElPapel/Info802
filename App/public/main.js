const apiUrl = "http://localhost:3000/api/";

async function getData(start, end) {
    return new Promise((resolve, reject) => {
        const url = apiUrl + `pathData/${start[0]}/${start[1]}/${end[0]}/${end[1]}`;
        console.log(url);
        axios.get(url)
        .then(response => {
            resolve(response.data);
        })
        .catch(err => {
            console.log(err);
            reject(err);
        });
    });
}

async function getClosestPoint(point) {
    return new Promise((resolve, reject) => {
        const url = apiUrl + `closestPoint/${point[0]}/${point[1]}`;
        console.log(url);
        axios.get(url)
        .then(response => {
            resolve(response.data);
        })
        .catch(err => {
            console.log(err);
            reject(err);
        });
    });
}



function showPopup(pixel, coord) {
    let popup = document.getElementById('popup');
    popup.style.display = 'flex';
    popup.style.top = pixel.y + 'px';
    popup.style.left = pixel.x + 'px';
    popup.style.transform = 'none';
    popup.style.zIndex = 999999;


    if (selectionMarker) {
        selectionMarker.remove();
    }
    selectedCoord = coord;
    selectionMarker = L.marker(coord, {
        icon: blackIcon
    });
    selectionMarker.addTo(map);
}


function closePopup() {
    document.getElementById('popup').style.display = 'none';
    selectionMarker?.remove();
}


async function setStart(coord) {
    const point = await getClosestPoint(coord);
    if (point) {
        start = point;

        if (startMarker) {
            startMarker.setLatLng(start);
        } else {
            startMarker = L.marker(start, {
                icon: greenIcon
            });
            startMarker.addTo(map);
        }
    }
}

async function setEnd(coord) {
    const point = await getClosestPoint(coord);
    if (point) {
        end = point;

        if (endMarker) {
            endMarker.setLatLng(end);
        } else {
            endMarker = L.marker(end, {
                icon: redIcon
            });
            endMarker.addTo(map);
        }
    }
}

var selectionMarker = null;
var selectedCoord = null;

var start = null;
var end = null;

var startMarker = null;
var endMarker = null;

var pathPolyline = [];
var pathMarker = [];

const setStartButton = document.getElementById("buttonSetStart");
const setEndButton = document.getElementById("buttonSetEnd");

setStartButton.addEventListener("click", (event) => {
    if (selectedCoord) {
        setStart(selectedCoord);
        resetPath();
    }
    closePopup();
});

setEndButton.addEventListener("click", (event) => {
    if (selectedCoord) {
        setEnd(selectedCoord);
        resetPath();
    }
    closePopup();
});


const map = L.map('map').setView([46.151, 6.33], 8);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);
map.doubleClickZoom.disable(); 


map.on("dblclick", async (event) => {
    showPopup(event.containerPoint, [event.latlng.lat, event.latlng.lng]);
});

map.on("move", async (event) => {
    closePopup();
});

map.on("zoomstart", async (event) => {
    closePopup();
});

function resetPath() {
    for (let p of pathPolyline) {
        p.remove();
    }

    for (let m of pathMarker) {
        m.remove();
    }

    pathMarker = [];
    pathPolyline = [];
}


async function displayPath() {
    if (!start || !end) {
        return;
    }

    resetPath();

    const data = await getData(start, end);


    for (let i = 0; i < data.paths.length - 1; i++) {
        let path = data.paths[i];

        pathPolyline.push(
            L.polyline(path, {color: 'red', weight: 5}).addTo(map)
        );
        
        pathMarker.push(
            L.marker(path[path.length-1], {
                icon: blueIcon
            }).addTo(map)
        )
    }
    let path = data.paths[data.paths.length - 1];

    pathPolyline.push(
        L.polyline(path, {color: 'red', weight: 5}).addTo(map)
    );
}