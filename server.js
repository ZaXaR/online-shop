const express = require("express"),
  database = require('./library/database'),
  router = require('./routes/router'),
  cors = require("cors"),
  app = express(),
  http = require("http"),
  favicon = require('serve-favicon'),
  morgan = require("morgan");

class Server {
  constructor() {
    this.start();
    this.initExpressMiddleWare();
    this.initCustomMiddleware();
    this.initRoutes();
    this.initDb();
  }

  start() {
    const httpServer = http.createServer(app);
    httpServer.listen(4200, () => {
      console.log('HTTP Server running on port 4200');
    });
  }

  initDb() {
    database.open(() => {
      console.log('database init')
    });
  }

  initExpressMiddleWare() {
    var corsOptions = {
      origin: "http://localhost:4200"
    };
    app.use(cors(corsOptions));
    app.use(express.json());
    app.use(express.urlencoded({extended: true}));
    app.use(favicon(__dirname + '/dist/favicon.ico'));
    app.use(express.static(__dirname + '/dist'));
    app.use(morgan('dev'));
    process.on('uncaughtException', (err) => {
      if (err) console.log(err, err.stack);
    });
  }

  initCustomMiddleware() {
    if (process.platform === "win32") {
      require("readline").createInterface({
        input: process.stdin,
        output: process.stdout
      }).on("SIGINT", () => {
        console.log('SIGINT: Closing MongoDB connection');
        database.close();
      });
    }

    process.on('SIGINT', () => {
      console.log('SIGINT: Closing MongoDB connection');
      database.close();
    });
  }

  initRoutes() {
    router.load(app, './controllers');

    // redirect all others to the index (HTML5 history)
    app.all('/*', (req, res) => {
      res.sendFile(__dirname + '/dist/index.html');
    });
  }
}

let server = new Server();
