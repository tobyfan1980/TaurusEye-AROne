/**
 * Created by gxu on 11/28/16.
 */
'use strict';
var mongoose = require('mongoose');
var uuid = require('node-uuid');


var noteSchema = new mongoose.Schema({
    note: {type: String},
    date: {type: Date}
});

noteSchema.index({"date": -1});


mongoose.model('notifications', noteSchema);
module.exports = mongoose.model('notifications');