const { default: axios } = require("axios");


async function getBorn(centerCoord, range) {
    return new Promise((resolve, reject) => {
        const url = `https://odre.opendatasoft.com/api/explore/v2.1/catalog/datasets/bornes-irve/records?where=within_distance(geo_point_borne%2C%20geom%27POINT(${centerCoord[0]}%2${centerCoord[1]})%27%2C%20${range}km)&limit=20`
        axios.get(url).then((response) => {
            if (response.data.total_count = 0) {
                resolve(null);
            } else {
                resolve([response.data.results[0].xlongitude, response.data.results[0].ylatitude]);
            }
        }).catch((err) => {
            console.log(err);
            reject(err);
        });
    });
}

module.exports = getBorn;