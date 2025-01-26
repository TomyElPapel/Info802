const getBorn = require("./getBorn");
const getPath = require("./getPath");
const getRideInfo = require("./getRideInfo");




async function getPathData(start, end, vehicule) {
    const vehicleData = {
        distance: 100,
        autonomie: 25,
        chargement: 800,
    }

    var totalDistance = 0;
    const rideInfo = await getRideInfo(vehicleData.distance, vehicleData.autonomie, vehicleData.chargement);
    
    let basePath = await getPath(start[0], start[1], end[0], end[1]);
    const distancePath = [];
    const bornPath = [];

    console.log(basePath)
    var d = 0;
    var i = 0;
    const ratio = 0.8;
    while (true) {
        d += getDistance(basePath.points[i][0], basePath.points[i][1], basePath.points[i + 1][0], basePath.points[i + 1][1]);
        distancePath[i] = d;

        if (d > vehicleData.autonomie * ratio) {
            while (true) {
                let born = await getBorn(basePath.points[i], Math.floor(vehicleData.autonomie * (1 - ratio)));
                if (born) {
                    basePath = await getPath(basePath.points[i][0], basePath.points[i][1], born[0], born[1]);
                    bornPath.push(born);
                    born = null;
                    i = 0;
                    d = 0;
                    break;
                }
                i--;
                if (i == -1) {
                    throw "aaaaaaaah";
                }
            }
        } else {
            i++;
            if (i >= basePath.points.length) {
                break;
            }
        }
    }

    return {
        time: rideInfo.time,
        price: rideInfo.price,
        bornesPath: bornPath,
        totalDistance: d
    };
}

function getDistance(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;

    const a = 
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
        Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}


module.exports = getPathData;