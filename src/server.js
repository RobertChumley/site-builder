import React from 'react';
import express from 'express';
import {TablesRouter} from "./api/routes/tables_router";
import {GenericRouter} from "./api/routes/generic_router";
import {ExternalApiRequestRouter} from "./api/routes/external_api_request_router";
import {Scheduler} from "./api/services/Scheduler";
const assets = require(process.env.RAZZLE_ASSETS_MANIFEST);
const server = express();

let scheudler = new Scheduler();
scheudler.startJob({});

server.use("*", (req, res, next) =>{
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.header('Expires', '-1');
    res.header('Pragma', 'no-cache');
    next();
});

server.param('table', (req, res, next, table) => {
    req.table = table;
    next();
});
server.use('/api/:table',(new GenericRouter().router));
server.use('/external', (new ExternalApiRequestRouter().router));
server
  .disable('x-powered-by')
  .use(express.static(process.env.RAZZLE_PUBLIC_DIR))
  .get(['/*','*'], (req, res) => {
      res.status(200).send(
        `<!doctype html>
         <html lang="">
            <head>
                <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
                <meta charSet='utf-8' />
                <title>Welcome to Razzle</title>
                <meta name="viewport" content="width=device-width, initial-scale=1">
                ${assets.client.css
                  ? `<link rel="stylesheet" href="${assets.client.css}">`
                  : ''}
                ${process.env.NODE_ENV === 'production'
                  ? `<script src="${assets.client.js}" defer></script>`
                  : `<script src="${assets.client.js}" defer crossorigin></script>`}
                <script
                  src="https://code.jquery.com/jquery-3.2.1.min.js"
                  integrity="sha256-hwg4gsxgFZhOsEEamdOYGBf13FyQuiTwlAQgxVSNgt4="
                  crossorigin="anonymous"></script>
                  <script src="https://d3js.org/d3.v4.min.js"></script>
                  <script src="http://labratrevenge.com/d3-tip/javascripts/d3.tip.v0.6.3.js"></script>
                  
            </head>
            <body>
                <div id="root"></div>
            </body>
         </html>`
      );
  });

export default server;
