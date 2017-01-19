/**
 * Created by gxu on 10/5/16.
 */

'use strict';
var User = require('../../models/users');
var responseError = require('../../lib/response_error.js');

function auth(res, next) {
    var self = this;
    var authToken = self.authToken;
    var headers = self.headers || {};

    self.logger.info("verify user token");
    User.findOne({"auth_token": authToken}, function(err, user){
        if (err || !user){
            self.logger.error("invalid token");
            self.logger.info("invalid token", {authToken: authToken});

        }

        else{
            //update user
            self.user = user;
            self.logger.info("user is ", user.name);
        }
        next(err);
    });

}


function isAdmin(user){
    if(user && user.level == 0){
        return true;
    }
    else{
        return false;
    }
}

function authAdmin(res, next){
    var self = this;
    var authToken = self.authToken;
    var endpoint = self.endpoint;
    auth.call(self, res, function done(err) {
        //self.logger.info("user is ", self.user);
        if (!err && isAdmin(self.user)) {
            next(null);
            return;
        }

        if (!err) {
            var msg = endpoint + ': not an admin account';
            self.logger.info(msg, {
                authToken: authToken
            });

            err = responseError({
                message: msg,
                type: 'arone.auth.Admin'
            });
        }

        res.status(403).json(err);
        next(err);
    });
}

module.exports = auth;
auth.admin = authAdmin;
