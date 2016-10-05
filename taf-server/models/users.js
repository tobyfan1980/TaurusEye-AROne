/**
 * Created by gxu on 10/4/16.
 */
var mongoose = require('mongoose');
var uuid = require('node-uuid');

var userTypes = ['wechat', 'facebook'];

var userSchema = new mongoose.Schema({
    client_id: {type: String, required: true, unique: true},
    access_token: String,
    user_type:{type: String, enum: userTypes},
    name: String,
    gender: String,
    photo_url: String,
    city: String,
    country: String,
});

userSchema.path('user_type').validate(function(val){
    return userTypes.indexOf(val) >= 0;
}, "user_type unknown");


userSchema.methods.update = function(user_info){
    if (user_info.hasOwnProperty('name'))
        this.name = user_info.name;
    if (user_info.hasOwnProperty('access_token'))
        this.access_token = user_info.access_token;
    if (user_info.hasOwnProperty('gender'))
        this.gender = user_info.gender;
    if (user_info.hasOwnProperty('photo_url'))
        this.photo_url = user_info.photo_url;

    if (user_info.hasOwnProperty('city'))
        this.city = user_info.city;
    if (user_info.hasOwnProperty('country'))
        this.country = user_info.country;

};

mongoose.model('User', userSchema);
module.exports = mongoose.model('User');