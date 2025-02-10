const express = require("express");
const router = express.Router();

const getPath = require("../../services/getPath");
const getPathData = require("../../services/getPathData");
const getVehiclesList = require("../../services/getVehiclesList");



router.get("/", async (req, res, err) => {
    try {
        const vehicles = await getVehiclesList();
        res.status(200).json(vehicles)
    } catch(e) {
        console.log(e);
        res.status(400).json(e);
    }
});



module.exports = router;