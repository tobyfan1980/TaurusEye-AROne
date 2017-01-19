'use strict';

angular.module('aroneApp').controller('MainCtrl', function ($scope, Session) {
  $scope.hello = 'from TaurusEye';
  $scope.user = Session.user
});
