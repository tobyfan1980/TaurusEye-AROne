/**
 * Created by gxu on 11/22/16.
 */
'use strict';

angular
  .module('aroneApp')
  .factory('Session', function () {
    var session = {
      user: null,
      token: null,

      redirect_login: "#/home"
    };
    session.resetRedirectLogin = function(){
      session.redirect_login = "#/home";
    };
    session.clear = function(){
      session.user=null;
      session.token = null;
      session.resetRedirectLogin();
    };
    session.setUser = function(u){
      session.user = u;
      session.token = u.token;
    };

    session.setToken = function(t) {
      session.token = t;
    };



    session.setRedirectLogin = function(link){
      session.redirect_login = link;
    };

    return session;

  });
