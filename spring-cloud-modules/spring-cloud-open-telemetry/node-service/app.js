
// "use strict";
const logger = require("./instrumentation")
const PORT = process.env.PORT || "8083";
const express = require("express");
const app = express();

app.get("/", (req, res) => {
  logger.info("greeting")
  res.json("Hello World");
});

app.get("/date", (req, res) => {
  logger.info("called /date")
  res.json({ today: new Date() });
});

app.listen(parseInt(PORT, 10), () => {
  logger.info(`Listening for requests on http://localhost:${PORT}`);
});