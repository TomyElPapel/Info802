const express = require("express");
const router = express.Router();

const getPath = require("../../services/getPath");
const getPathData = require("../../services/getPathData");



router.get("/:startLat/:startLon/:endLat/:endLon", async (req, res, err) => {
    const {startLat, startLon, endLat, endLon} = req.params;

    try {
        const data = await getPathData([startLat, startLon], [endLat, endLon], "roulette");
        res.status(200).json(data)
    } catch(e) {
        console.log(e);
        res.status(400).json(e)
    }
});



module.exports = router;