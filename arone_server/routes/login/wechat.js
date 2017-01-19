/**
 * Created by gxu on 10/4/16.
 */
var express = require('express');
var async = require('async');
var request = require('request');
var login = require('./common.js');
var mockProfile = require('../../test/mock/mock_profile.js');

function loginWechat(opts, req, res) {
    var openId = req.body.openId;

    if (!openId) {
        var err = new Error('openId must be provided');
        return res.status(400).send({
            error: err
        });
    }

    var accessToken = req.body.accessToken;
    if (!accessToken) {
        var err = new Error('access token must be provided');
        return res.status(400).send({
            error: err
        });
    }

    var param = {
        logger: opts.logger,
        account: {
            access_token: accessToken,
            id: openId
        },
        route: '/login/wechat'
    };

    var mocked = req.app.config.get('login.wechat.mocked');

    async.waterfall([
        mocked ? mockProfile.bind(param, res) : validateFromWechat.bind(param, res),
        login.bind(param, res)
    ], function (err) {
        if (err) {
            opts.logger.error('wechat validation failed', {error: err});
            res.status(404).send({
                error: err
            });
            return;
        }
        res.stats(200).send({
            id: param.account.id,
            auth_token: param.profile.auth_token,
            name: param.profile.name,
            country: param.profile.country,
            city: param.profile.city,
            gender: param.profile.gender,
            email: param.profile.email
        });
    });
}

function validateFromWechat(res, next){
    //validate token from wechat
    var self = this;
    request({
        url: 'https://api.weixin.qq.com/sns/userinfo',
        qs: {
            access_token: self.account.access_token,
            openid: self.account.id,
            lang: 'en'
        }
    }, function callback(err, response, body){
        if(err){
            console.log("wechat access token validatoin failed");
            next(err);
        } else if(response.statusCode !== 200){
            var error = new Error('response code is not 200 but ' + response.statusCode);
            error.status = 400;
            next(error);
        }else{
            var userinfo = JSON.parse(body);
            var gender = 'other';
            if (userinfo.sex === 1) {
                gender = 'male';
            } else if (userinfo.sex === 2) {
                gender = 'female';
            }


            self.profile = {
                name: userinfo.nickname,
                gender: gender,
                city: userinfo.city,
                country: userinfo.country,
                photo_url: userinfo.headimgurl
            };
            next();
        }
    });
}

module.exports = loginWechat;