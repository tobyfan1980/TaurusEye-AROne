/**
 * Created by gxu on 12/15/16.
 */

'use strict';

var app = angular.module('aroneApp');

app.controller('UserRankCtrl',
  ['$scope', 'User',
    function ($scope, User) {
      $scope.title = 'Top 10 Players';

      $scope.scores = [];

      $scope.cities = [];

      $scope.selectedCity = 'all';

      $scope.displayStyle = 'list';

      $scope.sortType = 'best_score';
      $scope.sortReverse = true;

      // get 10 most popular cities
      User.getUserDistribution(1, 10).then(function(cities){

        $scope.cities = cities;
      }, function (response) {
        console.log('Get user distribution error with status code', response.status);
      });

      // get top 10 users
      User.getBestScores('all').then(function(scores){
        for(var i=0; i<scores.length; i++){
          scores[i].userName = scores[i].user.name;
          scores[i].userType = scores[i].user.user_type;
          scores[i].gender = scores[i].user.gender;
          scores[i].rank = i + 1;
        }
        $scope.scores = scores;
      }, function(response){
        console.log('Error when getting ranks with status code', response.status);
      });

      $scope.getCityTopUsers = function (city_name) {
        $scope.selectedCity = city_name;
        $scope.title = 'Top 10 Players in ' + city_name;
        User.getBestScores(city_name).then(function (scores) {
          for(var i=0; i<scores.length; i++){
            scores[i].userName = scores[i].user.name;
            scores[i].userType = scores[i].user.user_type;
            scores[i].gender = scores[i].user.gender;
            scores[i].rank = i + 1;
          }
          $scope.scores = scores;

        }, function(response){
          console.log('Error when getting ranks of city %s with status code %d', city_name, response.status);
          $scope.scores = [];
        })
      };

      $scope.setDisplayStyle = function(style_name){
        $scope.displayStyle = style_name;
      }

    }
  ]);
