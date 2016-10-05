/**
 * Created by gxu on 10/4/16.
 */
var express = require('express');
var router = express.Router();
var request = require('request');
var login = require('./common.js');

router.post('/', function(req, res, next){
    var openId = req.body.openId;

    if(!openId){
        var err = new Error('openId must be provided');
        err.status = 400;

        next(err);
    }

    var accessToken = req.body.accessToken;
    if(!accessToken){
        var err =  new Error('access token must be provided');
        err.status = 400;
        next(err);
    }

    //validate token from weixin
    request({
        url: 'https://api.weixin.qq.com/sns/userinfo',
        qs: {
            access_token: accessToken,
            openid: openId,
            lang: 'en'
        }
    }, function callback(err, response, body){
       if(err){
           console.log("wechat token validatoin failed");
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


           var param = {
               client_id: openId,
               access_token: accessToken,
               name: userinfo.nickname,
               gender: gender,
               city: userinfo.city,
               country: userinfo.country,
               photo_url: userinfo.headimgurl
           };
           login.bind(param, res, next);
       }
    });


});

module.exports = router;