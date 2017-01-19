'use strict';
var bodyParser = require('body-parser');
var methodOverride = require('method-override');

var path = require('path');
var express = require('express');

var os = require('os');

function setupHTTPEndpoints(opts) {
    var app = opts.app;

    app.use(CORSHandler);
    //  app.get('/health', require('./health.js').bind(null, opts));

    // login
    //app.post('/login/facebook', require('./login/facebook.js').bind(null, opts));
    app.post('/login/wechat', require('./login/wechat.js').bind(null, opts));
    app.post('/login/guest', require('./login/guest.js').bind(null, opts));
    app.post('/login/admin', require('./login/admin.js').bind(null, opts));

    //best score
    app.post('/best_score', require('./game_scores/add_best_score.js').bind(null, opts));
    app.get('/best_score', require('./game_scores/get_best_score.js').bind(null, opts));
    app.get('/best_scores', require('./game_scores/get_all_best_scores.js').bind(null, opts));

    // users
    app.get('/users', require('./users/get_users.js').bind(null, opts));
    app.get('/user_dist', require('./users/get_user_distribution.js').bind(null, opts));

    // notifications
    app.get('/notes', require('./notes/get_notes.js').bind(null, opts));
    app.post('/notes', require('./notes/add_note.js').bind(null, opts));

    // test health
    app.get('/health', function (req, res) {
        res.send('OK');
    });

    app.use(bodyParser.urlencoded({
    extended: true,
    uploadDir: os.tmpdir()
    }));
    app.use(bodyParser.json());
    app.use(methodOverride());

    app.use(errorHandler.bind(opts));

    app.set('view engine', 'hjs');

    // development error handler
    // will print stacktrace
    if (opts.config.env === 'test') {
        opts.logger.info("this is debug mode, print out err stack in error page");
        app.use(function(err, req, res, next) {
            res.status(err.status || 500);
            res.render('error', {
                message: err.message,
                error: err
            });
        });
    }
    else{
        // production error handler
        // no stacktraces leaked to user
        app.use(function(err, req, res, next) {
            res.status(err.status || 500);
            res.render('error', {
                message: err.message,
                error: {}
            });
        });
    }


}

// CORS Support
function CORSHandler(req, res, next) {
    console.log('CORS');
    console.log(req.headers);
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, x-user-token, Access-Control-Allow-Origin');
    next();
}

function errorHandler(err, req, res, next) {
    var self = this;
    var msg = 'error in handling the RPC call (bad JSON body or exception in endpoint handler)';
    self.logger.info(msg, {
        url: req.url,
        errorMessage: err.message,
        errorStack: err.stack
    });
    res.status(500).json(
        responseError({
            message: msg,
            type: 'arone.endpoint',
            url: req.url,
            errorMessage: err.message
        })
    );
}

module.exports = {
  setupHTTPEndpoints: setupHTTPEndpoints
};

