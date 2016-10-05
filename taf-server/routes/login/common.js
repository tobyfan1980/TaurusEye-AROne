/**
 * Created by gxu on 10/4/16.
 */
var mongoose = require('mongoose');
var User = require('../../models/users');

function login(res, next){
    var self = this;

    User.findOne({"client_id": self.client_id}, function(err, user){
        if (err)
            next (err);
        else{
            if (user){
                user.update(self);
                user.save(function(err, user_data){
                    if (err){
                        next(err);
                    }else{
                        res.json(user_data);
                    }

                });
            }
            else{
                console.log('create user to db:' + user_info.name);
                var user = new User(self);
                user.save(function(err, user_data){
                    if(err){
                        console.log(err);
                        next(err);
                    }
                    else{
                        res.json(user_data);
                    }

                });
            }
        }
    });
}




module.exports = login;