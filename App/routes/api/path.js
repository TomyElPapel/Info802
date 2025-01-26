const express = require("express");
const router = express.Router();

const getPath = require("../../services/getPath");



router.get("/:startLat/:startLon/:endLat/:endLon", async (req, res, err) => {
    const {startLat, startLon, endLat, endLon} = req.params;

    try {
        const path = await getPath(startLat, startLon, endLat, endLon);
        res.status(200).json(path)
    } catch(e) {
        console.log(e);
        res.status(400).json(e)
    }
});



module.exports = router;