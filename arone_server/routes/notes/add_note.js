/**
 * Created by gxu on 12/17/16.
 */
'use strict';

// curl -X POST
// -H "Content-Type: application/json"
// -H "x-user-token: aaaaabbbbb"
// -d '{"note": "next release is Jan 7 2017"}'
//  "http://127.0.0.1:8888/notes"

var async = require('async');
var auth = require('../common/auth.js');
var Note = require("../../models/notifications");

function addNote(opts, req, res) {
    var authToken = req.headers['x-user-token'];
    var note = req.body.note;
    console.log("input cred: " + req.body);

    opts.logger.info('/notes', {
        headers: req.headers,
        query: req.body
    });


    if(!note){
        return res.status(400).send({
            error: new Error('No notification content')
        });
    }

    var param = {
        logger: opts.logger,
        authToken: authToken,
        endpoint: '/notes',
        note: note
    };

    var authAdmin = auth.admin;
    async.waterfall([
        authAdmin.bind(param, res),
        saveNote.bind(param, res)
    ], function done(err) {
        if (!err) {
            res.json(param.newNote);
        }
        else{
            opts.logger.error("failed to add note:" + err);
            res.status(400).send({"error": err.toString()});
        }
    });

}


function saveNote(res, next){
    var self = this;

    var newNote = {};

    newNote.date = new Date();
    newNote.note = self.note;

    Note.create(newNote, function(err, note){
        if(!err){
            self.logger.info("new notification added.");
            self.newNote = note;

        }
        next(err);
    });


}

module.exports = addNote;
