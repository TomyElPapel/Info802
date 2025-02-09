const getBorn = require("./getBorn");
const getPath = require("./getPath");
const getRideInfo = require("./getRideInfo");




async function getPathData(start, end, autonomie, chargement) {
    start = [parseFloat(start[0]), parseFloat(start[1])];
    end = [parseFloat(end[0]), parseFloat(end[1])];
    autonomie = parseFloat(autonomie);
    chargement = parseFloat(chargement);

    let currentPoint = start;
    const validPath = [];
    var totalDistance = 0;
    var stationNb = 0;


    while (true) {
        let currentPath = await getPath(currentPoint, end);
        if (currentPath.distance < autonomie * 1000) {
            totalDistance += currentPath.distance;
            validPath.push(currentPath.points);
            break;
        } else {
            let stations = await getBorn(currentPoint, autonomie, end);
 
            if (stations.length == 0) {
                console.log("aucune born dispo");
                break;
            }

            let stationPath = await getPath(currentPoint, stations[0]);
            totalDistance += getDistance(currentPoint, stationPath.points[stationPath.points.length - 1]) * 1000;
            currentPoint = stationPath.points[stationPath.points.length - 1];
            validPath.push(stationPath.points);
            stationNb++;
        }
    }

    const rideInfo = await getRideInfo(totalDistance / 1000, autonomie, chargement);

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


module.exports = getPathData;