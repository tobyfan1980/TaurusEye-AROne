/**
 * Created by gxu on 11/22/16.
 */
'use strict';

var app = angular.module('aroneApp');

app.controller('LoginCtrl', [
  '$scope', '$state', '$window', 'AuthService', 'Session',
  function ($scope, $state, $window, authService, session) {
    $scope.errorMsg = "";
    $scope.login = function (credentials) {

      authService.login(credentials).then(
        function (data) {
          if(data.login){
            console.log("login succeeds");
            var userInfo = {
              name: 'admin',
              token: data.token
            };
            session.setUser(userInfo);
            $scope.setCurrentUser(userInfo);

            //$state.go('home');
            var redirect_login = session.redirect_login;
            session.resetRedirectLogin();
            $window.location.href = redirect_login;
          }else
          {
            $window.alert("Login failed, please re-enter your credentials");
          }
        },function(response){

        }
      );
      /*
        .success(function (data, status, headers, config) {
          //$scope.setCurrentUser(data);

          console.log({header: headers});

          if(data.login){
            console.log("login succeeds");
            var userInfo = {
              user: 'admin',
              token: data.token
            };
            session.setUser(userInfo);
            var redirect_login = session.redirect_login;
            session.resetRedirectLogin();
            $window.location.href = redirect_login;
          }else
          {
            $window.alert("Login failed, please re-enter your credentials");
          }

        })
        .error(function (data, status, headers, config) {
          $window.alert("Login failed, please re-enter your credentials");
        });
        */

 /*
      if(credentials.username == 'admin' && credentials.password == '123'){
        var user = {name: 'admin'};
        session.setUser(user);
        session.setToken('aaaaabbbbb');
        //$scope.user = session.user;
        $scope.setCurrentUser(user);

        $state.go('home');
      }
      else{
        $window.alert("Login failed, please re-enter your credentials");
      }
      */
    };
  }
]);
