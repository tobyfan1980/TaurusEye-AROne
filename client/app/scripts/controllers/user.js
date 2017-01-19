/**
 * Created by gxu on 12/14/16.
 */
'use strict';

var app = angular.module('aroneApp');

/* Here the controllers are defines */
app.controller('UserCtrl',
  ['$scope', 'User',
    function ($scope, User) {
      $scope.title = 'AROne Users';

      $scope.users = [];
      $scope.pageSize = 10;

      $scope.cities = [];

      // get 10 most popular cities
      User.getUserDistribution(1, 10).then(function(cities){
        $scope.cities = cities;
      }, function (response) {
        console.log('Get user distribution error with status code', response.status);
      });

      // get users
      User.getUsers(0, $scope.pageSize).then(function(users){
        $scope.users = users;
      }, function(response){
        console.log('Error with status code', response.status);
      });

      $scope.sortType = 'name';
      $scope.sortReverse = false;
      $scope.searchUser = '';

      $scope.currentPage = 1;

      $scope.nextPage = function(){
        if ($scope.users.length < $scope.pageSize){
          return;
        }

        User.getUsers($scope.currentPage*$scope.pageSize, $scope.pageSize).then(function (users) {
          $scope.users = users;
          $scope.currentPage++;
        }, function (response) {
          console.log('Error getting users with status code:', response.status);
        });
      };
      $scope.prevPage = function(){
        if($scope.pageSize <= 1 ){
          return;
        }
        $scope.currentPage--;
        User.getUsers(($scope.currentPage-1)*$scope.pageSize, $scope.pageSize).then(function (users) {
          $scope.users = users;
        }, function (response) {
          console.log('Error getting users with status code:', response.status);
        });
      };

      $scope.numberOfPages = function() {
        return Math.ceil($scope.users.length/ $scope.pageSize);
      };

    }
  ]);
