const axios = require("axios");



async function getPath(start, end) {
    const url = `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${process.env.OPEN_ROUTE_SERVICE_TOKEN}&start=${start[1]},${start[0]}&end=${end[1]},${end[0]}`
    return new Promise((resolve, reject) => {
        try {
            axios.get(url).then((response) => {
                const coordinates = response.data.features[0].geometry.coordinates;
    
                const coordinatesDansLeBonSensePutain = []
    
                for (let c of coordinates) {
                    coordinatesDansLeBonSensePutain.push([c[1], c[0]]);
                }
    
                resolve({
                    points: coordinatesDansLeBonSensePutain,
                    distance: response.data.features[0].properties.summary.distance
                });
            }).catch((err) => {
                reject(err.message + "   "  + url)
            })
        } catch(err) {
            reject(err.message + url)
        }
    });
}

module.exports = getPath; 