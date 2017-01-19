/**
 * Created by gxu on 10/19/16.
 */
/**
 * Created by gxu on 10/18/16.
 */
'use strict';
var async = require('async');
var auth = require('../common/auth.js');
var GameScore = require('../../models/game_best_scores');
var User = require("../../models/users");
//
// test:
// curl -X GET "http://localhost:8888/best_scores?skip=0&limit=10&city=Beijing" \
//      -H "x-user-token: aaaaabbbbb" \
//      -H 'Content-Type: application/json' \


function getScores(opts, req, res) {
    var authToken = req.headers['x-user-token'];
    opts.logger.info('/best_scores', {
        headers: req.headers,
        query: req.query
    });

    var skip = req.query.skip;
    var limit = req.query.limit;

    if (skip == undefined || limit == undefined){
        opts.logger.error('skip and limit missing in request body');
        res.status(400).json({
            msg: 'skip and limit missing in request body'
        });
        return;
    }


    var param = {
        logger: opts.logger,
        authToken: authToken,
        endpoint: '/best_scores/get',
        skip: skip,
        limit: limit,
        city: req.query.city
    };



    var authAdmin = auth.admin;
    async.waterfall([
    //    authAdmin.bind(param, res),
        queryScores.bind(param, res)
    ], function done(err) {
        if (!err) {
            //opts.logger.info("scores: ", param.scores);
            res.json(param.scores);
        }
        else{
            opts.logger.error("failed to get score:" + err);
        }
    });

}

function queryScores(res, next) {
    var self = this;
    var skip = self.skip;
    var limit = self.limit;

    var filter = {};
    if(self.city && self.city != 'all'){
        self.logger.info('searching city wise top scorer: %s', self.city);

        filter.city = self.city;
    }

    GameScore
        .find(filter)
        .sort({best_score: -1})
        .skip(skip)
        .limit(limit)
        .populate('user', 'name user_type gender client_id photo_url')
        .exec(function(err, scores){
            if(err){
                next(err);

            }
            else {
                if (scores) {
                    self.logger.info("query returns %d top scores from %d", scores.length, skip);
                }
                self.scores = scores;
                next(err);
            }
        });
}

module.exports = getScores;
