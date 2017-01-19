/**
 * Created by gxu on 11/22/16.
 */
'use strict';

angular
  .module('aroneApp')
  .factory('AuthService', [
    'Restangular',
    function (Restangular) {
      var authService = {};

      authService.login = function (credentials) {
        return Restangular.all('login/admin').post(credentials);
          //.post('http://127.0.0.1:8888/login/admin', credentials);

      };

      return authService;
    }
  ]);
