const apiUrl = "http://localhost:3000/api/";

async function getData(start, end, ) {
    return new Promise((resolve, reject) => {
        const url = apiUrl + `pathData/${start[0]}/${start[1]}/${end[0]}/${end[1]}`;
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
    const dest = [48.849463264884, 2.297104125097473];
    const ori = [43.61310785069928, 1.4304570018636364];

    const map = L.map('map').setView([46.151, 6.33], 8);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);    

    const data = await getData(ori, dest);
    console.log(data)
    var polyline = L.polyline(data.path, {color: 'red', weight: 10}).addTo(map);
    L.marker(dest).addTo(map);
    L.marker(ori).addTo(map);
}

main();