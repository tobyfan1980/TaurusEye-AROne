/**
 * Created by gxu on 12/15/16.
 */

'use strict';
var async = require('async');
var auth = require('../common/auth.js');
var User = require("../../models/users");
//
// test:
// curl -X GET "http://localhost:8888/user_dist?isTop=1&limit=5" \
//      -H "x-user-token: aaaaabbbbb" \
//      -H 'Content-Type: application/json'

function getUserDist(opts, req, res) {
    var authToken = req.headers['x-user-token'];
    //opts.logger.info("user token: %s", authToken);

    opts.logger.info('/users', {
        headers: req.headers,
        query: req.query
    });

    var limit = parseInt(req.query.limit);
    var isTop = parseInt(req.query.isTop);
    if (isTop == undefined || limit == undefined){
        res.status(400).json({
            msg: 'isTop or limit missing in request body'
        });
        return;
    }

    var param = {
        logger: opts.logger,
        authToken: authToken,
        endpoint: '/users',
        limit: limit,
        isTop: isTop

    };

    var authAdmin = auth.admin;
    async.waterfall([
        authAdmin.bind(param, res),
        queryUserDist.bind(param, res)
    ], function done(err) {
        if (!err) {
            res.json(param.cities);
        }
        else{
            opts.logger.error("failed to get score:" + err);
        }
    });
}


function queryUserDist(res, next){
    var self=this;
    var isTop = self.isTop;
    var limit = self.limit;

    console.log('find user distribution isTop %d', isTop);

    var sortCount = -1;
    if(!isTop){
        sortCount = 1;
    }
    User.aggregate(
        [
            // match pipeline
            {'$match': {
                level:{$gt: 0}
            }},

            // group pipeline
            {'$group': {
                '_id': '$city',
                'userCount': {'$sum': 1}
            }},
            {'$sort': {'userCount': sortCount}},
            {'$limit': limit}
        ],
        function(err, results){
            if (!err) {

                self.logger.info("query returns top %d cities", results.length);
                self.cities = results;

            }
            next(err);
        });


}

module.exports = getUserDist;
