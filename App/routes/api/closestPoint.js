const express = require("express");
const router = express.Router();

const getPath = require("../../services/getPath");
const getClosestPoint = require("../../services/getClosestPoint");



router.get("/:lat/:lon", async (req, res, err) => {
    const {lat, lon} = req.params;

    try {
        const point = await getClosestPoint([lat, lon]);
        res.status(200).json(point)
    } catch(e) {
        console.log(e);
        res.status(400).json(e);
    }
});



module.exports = router;