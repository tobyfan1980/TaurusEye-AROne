/**
 * Created by gxu on 10/12/16.
 */
var express = require('express');
var async = require('async');
var request = require('request');
var login = require('./common.js');
var mockProfile = require('../../test/mock/mock_profile.js');

function loginGuest(opts, req, res) {
    var userId = req.body.userId;

    if (!userId) {
        var err = new Error('userId must be provided');
        return res.status(400).send({
            error: err
        });
    }



    var param = {
        logger: opts.logger,
        account: {
            id: userId
        },
        profile: {},
        route: '/login/guest'
    };

    async.waterfall([
        login.bind(param, res)
    ], function (err) {
        if (err) {
            opts.logger.error('guest login failed', {error: err});
            res.status(404).send({
                error: err
            });
            return;
        }
        res.stats(200).send({
            id: param.account.id,
            auth_token: param.profile.auth_token
        });
    });
}


module.exports = loginGuest;