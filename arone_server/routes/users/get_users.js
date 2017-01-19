/**
 * Created by gxu on 10/19/16.
 */

'use strict';
var async = require('async');
var auth = require('../common/auth.js');
var User = require("../../models/users");
//
// test:
// curl -X POST "http://localhost:8888/users" \
//      -H "x-user-token: aaaaabbbbb" \
//      -H 'Content-Type: application/json' \
//      -d '{
//
//              "skip" : 0,
//              "limit" : 10
//          }'

function getUsers(opts, req, res) {
    var authToken = req.headers['x-user-token'];
    //opts.logger.info("user token: %s", authToken);

    opts.logger.info('/users', {
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
        endpoint: '/users',
        skip: skip,
        limit: limit

    };

    var authAdmin = auth.admin;
    async.waterfall([
        authAdmin.bind(param, res),
        queryUsers.bind(param, res)
    ], function done(err) {
        if (!err) {
            res.json(param.users);
        }
        else{
            opts.logger.error("failed to get score:" + err);
        }
    });


}


function queryUsers(res, next){
    var self=this;
    var skip = self.skip;
    var limit = self.limit;

    User.find({level:{$ne: 0}})
        .skip(skip)
        .limit(limit)
        .exec(function(err, users){
            if (!err) {

                self.logger.info("query returns %d users from %d", users.length, skip);
                self.users = users;

            }
            next(err);
        });


}

module.exports = getUsers;
