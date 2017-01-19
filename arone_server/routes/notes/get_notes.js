/**
 * Created by gxu on 12/16/16.
 */


'use strict';
var async = require('async');
var auth = require('../common/auth.js');
var Note = require("../../models/notifications");
//
// test:
// curl -X POST "http://localhost:8888/notes?skip=0&limit=10" \
//      -H "x-user-token: aaaaabbbbb" \
//      -H 'Content-Type: application/json' \


function getNotifications(opts, req, res) {
    var authToken = req.headers['x-user-token'];
    //opts.logger.info("user token: %s", authToken);

    opts.logger.info('/notes', {
        headers: req.headers,
        query: req.query
    });

    var skip = req.query.skip;
    var limit = req.query.limit;

    if (skip == undefined || limit == undefined){
        res.status(400).json({
            msg: 'skip and limit missing in request body'
        });
        return;
    }

    var param = {
        logger: opts.logger,
        authToken: authToken,
        endpoint: '/notes',
        skip: skip,
        limit: limit

    };

    var authAdmin = auth.admin;
    async.waterfall([
        //    authAdmin.bind(param, res),
        queryNotifications.bind(param, res)
    ], function done(err) {
        if (!err) {
            res.json(param.notes);
        }
        else{
            opts.logger.error("failed to get notification:" + err);
            res.status(400).send({"error": err.toString()});
        }
    });


}


function queryNotifications(res, next){
    var self=this;
    var skip = self.skip;
    var limit = self.limit;

    Note.find({})
        .sort({date: -1})
        .skip(skip)
        .limit(limit)
        .exec(function(err, notifications){
            if (!err) {

                self.logger.info("query returns %d notifications from %d", notifications.length, skip);
                self.notes = notifications;

            }
            next(err);
        });


}

module.exports = getNotifications;
