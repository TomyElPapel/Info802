const axios = require("axios");



async function getClosestPoint(coord) {
    return new Promise((resolve, reject) => {
            const url = `https://api.openrouteservice.org/v2/snap/driving-car`
            axios.post(url, {
                "locations":[
                    [coord[1], coord[0]]
                ],
                "radius": 500
            }, {
                headers: {
                    Authorization: `Bearer ${process.env.OPEN_ROUTE_SERVICE_TOKEN}`
                }
            }
            ).then((response) => {
                const l = response.data.locations[0];
                if (l) {
                    resolve([l.location[1], l.location[0]]);
                } else {
                    resolve(null);
                }
            }).catch((err) => {
                reject(err.message);
            });
        });
}


module.exports = getClosestPoint;