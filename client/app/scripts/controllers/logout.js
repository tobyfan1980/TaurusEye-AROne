/**
 * Created by gxu on 12/16/16.
 */
var app = angular.module("aroneApp");


app.controller('LogoutCtrl', [
  '$scope', '$state', '$window', 'Session',
  function ($scope, $state, $window, session) {
    // clear
    session.clear();

    $state.go('home');
    //$window.location.href = '#/home';

  }
]);
