"use strict";
const express = require("express");
const compression = require("compression");
const request = require("request");
var proxy = require('express-http-proxy');
var {createProxyMiddleware} = require('http-proxy-middleware');

const _port = 3000;
const _app_folder = '.';

const app = express();
app.use(compression());

app.use(
  '/api',
  createProxyMiddleware({
    "target": "https://www.duolingo.com",
    "secure": true,
    "changeOrigin": true,
    "loglevel": "debug",
    "pathRewrite": {"^/api" : ""},
    "cookieDomainRewrite": "localhost"
  })
);

const path = "/dist/duolingo-flashcards";
// ---- SERVE STATIC FILES ---- //
app.get('*.*', express.static(_app_folder + path, { maxAge: '1y' }));

// ---- SERVE APLICATION PATHS ---- //
app.all('*', function (req, res) {
  res.status(200).sendFile(path + `/index.html`, { root: _app_folder });
});

// ---- START UP THE NODE SERVER  ----
app.listen(_port, function () {
  console.log("Node Express server for " + app.name + " listening on http://localhost:" + _port);
});