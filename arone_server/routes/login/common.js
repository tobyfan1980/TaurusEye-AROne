/**
 * Created by gxu on 10/4/16.
 */
var mongoose = require('mongoose');
var User = require('../../models/users');
var crypto = require('crypto');

function login(res, next){
    var self = this;

    User.findOne({"client_id": self.account.id}, function(err, user){
        if (err)
            next (err);
        else{
            self.profile.client_id = self.account.id;
            self.profile.access_token = self.account.access_token;
            if (user){

                user.update(self.profile);
                user.save(function(err, user_data){
                    if (err){
                        next(err);
                    }else{
                        next();
                    }

                });
            }
            else{
                self.logger.info('create user to db:' + self.profile.client_id);

                crypto.randomBytes(32, function(err, buffer){
                    if(err){
                       self.logger.error('cannot generate auth_token because of randomBytes failed', {
                           error: err
                       });
                       next(err);
                    }
                    var auth_token = buffer.toString('hex');
                    self.profile.auth_token = auth_token;
                    var user = new User(self.profile);
                    user.save(function(err, user_data){
                        if(err){
                            console.log(err);
                            next(err);
                        }
                        else{
                            next();
                        }

                    });
                });

            }
        }
    });
}




module.exports = login;