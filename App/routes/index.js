const express = require("express");
const router = express.Router();
const path = require("path");



router.get("/", async (req, res, err) => {
    try {
        res.status(200).sendFile(path.resolve("./public/index.html"));
    } catch(e) {
        res.status(400).json(e)
    }
});

module.exports = router;