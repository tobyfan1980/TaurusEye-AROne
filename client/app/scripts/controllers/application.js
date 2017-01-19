/**
 * Created by gxu on 11/23/16.
 */
var app=angular.module('aroneApp');

app.controller('ApplicationCtrl', function ($scope) {
  $scope.currentUser = null;

  $scope.setCurrentUser = function(data){
    $scope.currentUser = data;
  };

  $scope.clearCurrentUser = function(){
    $scope.currentUser = null;
  }

});
