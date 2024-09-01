"use strict";

const mongoose = require("mongoose");
const os = require("os");
const process = require("process");
const _SECOND = 5000;

const countConnect = () => {
  const numsConnection = mongoose.connections.length;
  console.log(`Numer of connections::${numsConnection}`);
};

//check over load
const checkOverLoad = () => {
  setInterval(() => {
    const numsConnection = mongoose.connections.length;
    const numsCore = os.cpus().length;
    const memoryUsage = process.memoryUsage().rss;
    // Example maximum number of connections based on number of cores
    const maxConnections = numsCore * 5;
    console.log(`Active connections::${numsConnection}`)
    console.log(`Memory Usage::${memoryUsage / 1024 / 1024}MB`)
    if(numsConnection > maxConnections) {
        console.log(`Connection overload detected!`)
    }
  }, _SECOND); // Monitor every 5s
};

module.exports = { countConnect, checkOverLoad };
