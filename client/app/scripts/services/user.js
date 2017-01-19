/**
 * Created by gxu on 12/14/16.
 */
'use strict';

var app = angular.module('aroneApp');

app.factory('User', ['Restangular', 'Session', function(Restangular, session){


  //Restangular.setDefaultHeaders({x-user-token: })

  var userService = {};

  userService.getUsers = function(skip, limit){

    return Restangular.all('users').getList({skip: skip, limit: limit},
                                 {'Content-Type': 'application/json',
                                   'x-user-token': session.token});

  };

  userService.getAllUsers = function(){
    return Restangular.all('users').getList({skip: 0, limit: 10},{'x-user-token': session.token});
  };

  userService.getBestScores = function(city){
    return Restangular.all('best_scores').getList({city:city, skip:0, limit:10}, {'x-user-token': session.token});
  };

  userService.getUserDistribution = function (isTop, topCount) {

    return Restangular.all('user_dist').getList({isTop: isTop, limit:topCount}, {'x-user-token': session.token});
  };

  return userService;
}]);
