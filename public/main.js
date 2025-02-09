const apiUrl = "http://localhost:3000/api/";

async function getData(start, end, distance, charge) {
    return new Promise((resolve, reject) => {
        const url = apiUrl + `pathData/${start[0]}/${start[1]}/${end[0]}/${end[1]}/${distance}/${charge}`;
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

function createElement(tag, { classes = [], textContent = '', parent = null } = {}) {
    const element = document.createElement(tag);

    if (Array.isArray(classes)) {
        element.classList.add(...classes);
    }

    if (textContent) {
        element.textContent = textContent;
    }

    if (parent instanceof HTMLElement) {
        parent.appendChild(element);
    }

    return element;
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


const setStartButton = document.getElementById("buttonSetStart");
const setEndButton = document.getElementById("buttonSetEnd");

const priceP = document.getElementById("price");
const timeP = document.getElementById("time");
const distanceP = document.getElementById("distance");


const selectedVehicleDiv = document.getElementById("selectedDiv");

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
    showPopup({
        x: event.originalEvent.clientX,
        y: event.originalEvent.clientY
    }, [event.latlng.lat, event.latlng.lng]);
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

    timeP.textContent = "temps trajet : ?";
    priceP.textContent = "prix trajet : ?";
    distanceP.textContent = "distance : ?";

    pathMarker = [];
    pathPolyline = [];
}


async function displayPath() {
    if (!start || !end) {
        return;
    }

    if (!selectedVehicle) {
        return;
    }

    resetPath();
    const data = await getData(start, end, selectedVehicle.range.chargetrip_range.worst, selectedVehicle.connectors[0].time / 60);

    timeP.textContent = "temps trajet : " + timeToStr(data.time);
    priceP.textContent = "prix trajet : " + data.price + "€";
    distanceP.textContent = "distance : " + Math.round(data.totalDistance / 1000) + "km";

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

function timeToStr(time) {
    const h = Math.floor(time);
    const m = Math.floor((time - h) * 60);
    return h + "h " + m + "min"; 
}

async function vehicleSetup() {
    const query = `query vehicleList($page: Int, $size: Int, $search: String) {
        vehicleList(
          page: $page, 
          size: $size, 
          search: $search, 
        ) {
          id
          naming {
            make
            model
          }
          media {
            image {
              thumbnail_url
            }
          }
          range {
            chargetrip_range {
              worst
              best
            }
          }
          connectors {
            time
          }
        }
      }`;


    fetch('https://api.chargetrip.io/graphql', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            'x-client-id': '5ed1175bad06853b3aa1e492',
            'x-app-id': '623998b2c35130073829b2d2',
        },
        body: JSON.stringify({
            query: query,
            variables: { page: 0, size: 20 },
        })
    }).then(async (res) => {
        const vehicles = (await res.json()).data.vehicleList;

        const vList = document.getElementById("vehicleList");
        console.log(vehicles);
        for (let v of vehicles) {
            let e = createVehicleElement(v);
            e.addEventListener("click", (e) => {
                setSelectedVehicle(v);
            });
            vList.appendChild(e);
        }


    }).catch((e) => {
        if (e) console.log(e);
    });
}

function setSelectedVehicle(vehicle) {
    resetPath();
    selectedVehicle = vehicle;
    while (selectedVehicleDiv.childElementCount > 0) {
        selectedVehicleDiv.children[0].remove();
    }
    const img = createElement("img");
    img.src = vehicle.media.image.thumbnail_url;
    selectedVehicleDiv.appendChild(img);
    selectedVehicleDiv.appendChild(createElement("p", {textContent: vehicle.naming.make}));
    selectedVehicleDiv.appendChild(createElement("p", {textContent: vehicle.naming.name}));
    selectedVehicleDiv.appendChild(createElement("p", {textContent: "distance : " + vehicle.range.chargetrip_range.best + "km"}));
    selectedVehicleDiv.appendChild(createElement("p", {textContent: "temps par charge : " + timeToStr(vehicle.connectors[0].time / 60)}));
}

function createVehicleElement(vehicle) {
    const div = createElement("div", { classes: ["vehicle"]});
    const d = createElement("div");
    const name = createElement("p", { textContent: vehicle.naming.model});
    const make = createElement("p", { textContent: vehicle.naming.make});
    const img = createElement("img");
    img.src = vehicle.media.image.thumbnail_url;

    div.appendChild(img);
    div.appendChild(d);
    d.appendChild(make);
    d.appendChild(name);

    return div;
}

var selectedVehicle = null;

var selectionMarker = null;
var selectedCoord = null;

var start = null;
var end = null;

var startMarker = null;
var endMarker = null;

var pathPolyline = [];
var pathMarker = [];

async function main() {
    vehicleSetup();
}


main();


