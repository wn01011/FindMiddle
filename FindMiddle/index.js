"use strict";

const express = require("express");

const app = express();
const PORT = 8080;
app.get("/", (req, res) => {
  res.send();
});

app.listen(PORT, () => {
  console.log("서버 열음");
});
