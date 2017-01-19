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
// curl -X POST "http://localhost:8888/game_scores/add_score" \
//      -H "Content-Type: application/json" \
//      -H "x-user-token: b9f329e942264813bea8cd57ded56c27b723b6b7a173f29f5bfb380789bef5a4" \
//      -d '{
//              "clientID": ["b017e8cb-f458-4f32-8b34-6429d3bb0415"],
//              "score": 8552220,
//          }'
//


function addScore(opts, req, res) {
    var authToken = req.headers['x-user-token'];
    var clientID = req.body.clientID;
    var score = req.body.score;

    var param = {
        logger: opts.logger,
        authToken: authToken,
        clientID: clientID,
        score: score

    };

    async.waterfall([
        auth.bind(param, res),
        updateUserBestScore.bind(param, res)
    ], function done(err) {
        if (!err) {
            res.status(200).json({
                rank: param.rank
            });
        }
    });

}

function updateUserBestScore(res, next) {
    var self = this;
    var clientID = self.clientID;
    var score = self.score;

    GameScore.find({user: clientID}, function(err, score){
       if(err){
           next(err);

       }
        else {
           if (!score) {
               //first time, add entry
               var score_entry = {
                   user: clientID,
                   best_score: score
               }

               var item = GameScore(score_entry);
               item.save(function (err, score_data) {
                   if (err) {
                       self.logger.error(err);
                       next(err);
                   } else {
                       // get rank and return
                       self.rank = getScoreRank(score, next);
                       next(null);
                   }
               });

           }
           else {
               score.best_score = score;
               socre.save(function (err, score_data) {
                   if (err) {
                       self.logger.error(err);
                       next(err);
                   } else {
                       // get rank and return
                       self.rank = getScoreRank(score, next);
                       next(null);
                   }
               })
           }
       }
    });
}

function getScoreRank(score, next){
    GameScore.count( {best_score: {$gt: score}}, function(err, better_count){
       if (err){
           next(err);
       }
       else{
           return better_count + 1;
       }
    });

}

module.exports = addScore;
