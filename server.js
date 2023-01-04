"use strict";
const express = require("express");
var { createProxyMiddleware } = require('http-proxy-middleware');
const { stringify } = require("querystring");

const _port = process.env.PORT || 80;
const _app_folder = '.';

const app = express();

app.use(
  '/api',
  createProxyMiddleware({
    "target": "https://www.duolingo.com",
    "secure": true,
    "changeOrigin": true,
    "loglevel": "debug",
    "pathRewrite": { "^/api": "" },
    "cookieDomainRewrite": "localhost"
  })
);

const key = process.env.private_key;
const path = "/dist/duolingo-flashcards";
// ---- SERVE STATIC FILES ---- //
app.get("/key.json", (req, res) => {
  res.status(200).send(JSON.stringify({key:key}));
});
app.get('*.*', express.static(_app_folder + path, { maxAge: '1y' }));


// ---- SERVE APLICATION PATHS ---- //
app.all('*', function (req, res) {
  res.status(200).sendFile(path + `/index.html`, { root: _app_folder });
});

// ---- START UP THE NODE SERVER  ----
app.listen(_port, function () {
  console.log("Node Express server for " + app.name + " listening on http://localhost:" + _port);
});