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


async function main() {
    const dest = [48.85720420695038, 2.34708152969578];
    const ori = [45.64426567622021, 5.867705957983265];

    const map = L.map('map').setView([46.151, 6.33], 8);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);    

    const data = await getData(ori, dest);

    console.log(data.totalDistance);

    L.marker(dest).addTo(map);
    L.marker(ori).addTo(map);

    for (let path of data.paths) {
        L.polyline(path, {color: 'red', weight: 10}).addTo(map);
        L.marker(path[path.length-1]).addTo(map);
    }
}

main();