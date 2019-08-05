const bodyParser = require('body-parser');
const express = require('express');
const session = require('express-session');
const { v4 } = require('uuid');
const { SwishServer } = require('express-swish-protocol');

async function loadRoutes(app, routes) {
  routes.array.forEach((route) => {
    app.use(route);
  });
}

module.exports = class SwishAPI {
  constructor(config) {
    if (!config.name) { // require a name
      throw new Error('API_NAME_MISSING');
    }
    this.name = config.name;
    this.port = config.port;
    this.routes = config.routes;

    this.app = express();
    this.app.use(bodyParser.json());
    this.app.set('trust proxy', 1); // trust first proxy

    this.app.use(session({
      genid: () => v4(), // generate a UUIDv4 session id
      resave: true,
      saveUninitialized: true,
      secret: 'keyboard cat',
    }));
    loadRoutes(this.app, this.routes);
    this.app.use(SwishServer);
  }

  start() {
    this.app.listen(this.port, () => console.log(`Example app listening on port ${this.port}!`));
  }
};
