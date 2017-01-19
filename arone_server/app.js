var express = require('express');
var http = require('http');
var fs = require('fs');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var setupHTTPEndpoints = require('./routes/').setupHTTPEndpoints;
var winston = require('winston');
var mongoose = require('mongoose');


function Application(opts){
    if(!(this instanceof Application)){
        return new Application(opts);
    }


    var self = this;

    self.logger = opts.logger;
    self.config = opts.config;

    self.app = express();
    self.app.use(bodyParser.json( {type: 'application/json'}));
    self.app.use(bodyParser.urlencoded({ extended: false }));
    self.httpServer = http.createServer(self.app);

    setupHTTPEndpoints({
        app: self.app,
        config: self.config,
        logger: self.logger
    });
}

Application.prototype.bootstrap = function bootstrap(callback){
    var self = this;

    self.dbBootstrap(function(err){
        if (err){
            self.logger.error("Mongoose default connection error: " + err);
        }
    });


    self.bootstrapHTTPServer(function(err){
       if(err && err.length > 0) {
           return callback(err);
       }else
           return callback();
    });

}

Application.prototype.dbBootstrap = function (callback) {
    var self = this;
    var db_url = 'mongodb://' + self.config['mongodb']['host'] + "/" + self.config['mongodb']['database'];

    mongoose.Promise = global.Promise;
    mongoose.connect(db_url);
    var db = mongoose.connection;

    self.db = db;
    self.db.on('error', function(err){
        return callback(err);
    });
    self.db.on('connected', function(){
        self.logger.info("Mongoose db connection openned to %s", db_url);
        return callback();
    })
}

Application.prototype.bootstrapHTTPServer = function bootstrapHTTPServer(callback) {
    var self = this;
    self.httpServer.on('error', onError);
    self.httpServer.on('listening', onListening);
    self.httpServer.on('connection', onConnection);
    self.httpServer.listen(self.config.port, '0.0.0.0');
    function onError(error) {
        self.logger.error('http server failed', {
            error: error
        });
        return callback(error);
    }
    function onListening() {
        self.logger.info('http server listening on', {
            address: self.httpServer.address()
        });
        return callback();
    }
    function onConnection(socket) {
        socket.setTimeout(60000);
    }
};

module.exports = Application;
