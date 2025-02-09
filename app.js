const dotenv = require("dotenv");
const cors = require('cors')

dotenv.config();

const express = require("express");
const path = require("path");
const routerSetup = require("./scripts/routerSetup");

(async () => {
    const app = express();
    app.use(express.json());
    app.use(cors());
    app.use(express.static(path.join(__dirname, 'public')));

    const port = process.env.PORT;
    const routesDir = path.join(__dirname, "routes");
    
    await routerSetup(routesDir, app, "/");

    app.get("/", (req, res, err) => {
        res.send("main");
    });

    app.listen(port, () => {
        console.log("server up on port : " + port);
    });
})();


