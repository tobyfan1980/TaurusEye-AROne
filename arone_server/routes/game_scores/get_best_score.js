/**
 * Created by gxu on 11/29/16.
 */

'use strict';
var async = require('async');
var auth = require('../common/auth.js');
var GameScore = require('../../models/game_best_scores');
var User = require("../../models/users");
//
// test:
// curl -X GET "http://localhost:8888/game_scores/get_best_score" \
//      -H "x-user-token: yuyuyuy7873615" \
//      -H 'Content-Type: application/json' \
//


function getScore(opts, req, res) {
    var authToken = req.headers['x-user-token'];
    opts.logger.info("user token: %s", authToken);

    var param = {
        logger: opts.logger,
        authToken: authToken,
        endpoint: '/best_score/get'

    };
    async.waterfall([
        auth.bind(param, res),
        queryScore.bind(param, res)
    ], function done(err) {
        if (!err) {
            res.status(200).json({
                score: param.score
            });
        }
        else{
            opts.logger.error("failed to get score:" + err);
        }
    });

}

function queryScore(res, next) {
    var self = this;

    GameScore
        .findOne({"user":self.user._id})
        .sort({best_score: -1})
        .populate('user', 'name client_id')
        .exec(function(err, score){
            if(err){
                next(err);

            }
            else {
                if (score) {

                    self.logger.info("query returns score ", score);

                }
                self.score = score;
                next(err);
            }
        });
}

module.exports = getScore;
