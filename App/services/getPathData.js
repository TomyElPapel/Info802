const getBorn = require("./getBorn");
const getPath = require("./getPath");
const getRideInfo = require("./getRideInfo");




async function getPathData(start, end, vehicule) {
    start = [parseFloat(start[0]), parseFloat(start[1])];
    end = [parseFloat(end[0]), parseFloat(end[1])];

    const vehicleData = {
        distance: 100,
        autonomie: 100,
        chargement: 400,
    }

    const rideInfo = await getRideInfo(vehicleData.distance, vehicleData.autonomie, vehicleData.chargement);
    
    let currentPoint = start;
    const validPath = [];
    var totalDistance = 0;
    var stationNb = 0;


    while (true) {
        let currentPath = await getPath(currentPoint, end);
        if (currentPath.distance < vehicleData.autonomie * 1000) {
            totalDistance += currentPath.distance;
            validPath.push(currentPath.points);
            break;
        } else {
            let stations = await getBorn(currentPoint, vehicleData.autonomie, end);
 
            if (stations.length == 0) {
                console.log("aucune born dispo");
                break;
            }

            console.log(stations);

            let stationPath = await getPath(currentPoint, stations[0]);
            totalDistance += getDistance(currentPoint, stationPath.points[stationPath.points.length - 1]) * 1000;
            currentPoint = stationPath.points[stationPath.points.length - 1];
            console.log(currentPoint);
            validPath.push(stationPath.points);
            stationNb++;
        }
    }

    return {
        time: rideInfo.time,
        price: rideInfo.price,
        paths: validPath,
        totalDistance: totalDistance,
        stationNb: stationNb
    };
}

function getDistance(point1, point2) {
    const R = 6371;
    const dLat = (point2[0] - point1[0]) * Math.PI / 180;
    const dLon = (point2[1] - point1[1]) * Math.PI / 180;

    const a = 
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(point1[0] * Math.PI / 180) * Math.cos(point2[0] * Math.PI / 180) * 
        Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}


function orderPointsByDistance(points, center) {
    return points.sort((a, b) => {
        const distanceA = getDistance(a, center);
        const distanceB = getDistance(b, center);
        return distanceA - distanceB;
    });
} 


module.exports = getPathData;