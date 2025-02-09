const { default: axios } = require("axios");


async function getBorn(centerCoord, range, targetCoord) {
    return new Promise((resolve, reject) => {
        const url = `https://odre.opendatasoft.com/api/explore/v2.1/catalog/datasets/bornes-irve/records?where=within_distance(geo_point_borne%2C%20geom'POINT(${centerCoord[1]} ${centerCoord[0]})'%2C%20${range}km)&order_by=distance(geo_point_borne%2C%20geom'POINT(${targetCoord[1]} ${targetCoord[0]})')&limit=20`
        axios.get(url).then((response) => {
            const points = []
            for (let res of response.data.results) {
                points.push([parseFloat(res.ylatitude), parseFloat(res.xlongitude)]);
            }
            resolve(points);
        }).catch((err) => {
            console.log(err);
            reject(err);
        });
    });
}

module.exports = getBorn;