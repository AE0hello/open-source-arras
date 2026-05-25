const { workerData, parentPort } = require("worker_threads");
const { gameServer } = require("./game.js");

let GLOBAL = require("./loaders/loader.js");
new gameServer(
    workerData.host,
    workerData.port,
    workerData.gamemode,
    workerData.region,
    workerData.webProperties,
    workerData.properties,
    workerData.isFeatured,
    parentPort,
    GLOBAL
);
