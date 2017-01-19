/**
 * Created by gxu on 10/18/16.
 */
'use strict';
var mongoose = require('mongoose');
var uuid = require('node-uuid');


var scoreSchema = new mongoose.Schema({
    best_score: {type: Number},
    city: {type: String, index: true},
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'users'
    }
});

scoreSchema.index({"best_score": -1});


scoreSchema.methods.update = function(score_info){
    if (score_info.hasOwnProperty('best_score'))
        this.best_score = score_info.best_score;

};

mongoose.model('best_scores', scoreSchema);
module.exports = mongoose.model('best_scores');