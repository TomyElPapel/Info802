const axios = require("axios");



async function getPath(startLat, startLon, endLat, endLon) {
    const url = `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${process.env.OPEN_ROUTE_SERVICE_TOKEN}&start=${startLon},${startLat}&end=${endLon},${endLat}`
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
                console.log(err);
                reject(err);
            })
        } catch(err) {
            console.log(err);
            reject(err)
        }
    });
}

module.exports = getPath; 