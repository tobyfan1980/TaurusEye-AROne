'use strict';

var app = angular.module('aroneApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'restangular',
  'ui.router'
]);

app.config(function (RestangularProvider) {
  RestangularProvider.setBaseUrl('http://127.0.0.1:8888');
  RestangularProvider.setDefaultHeaders({'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '127.0.0.1'})
});


app.config(['$stateProvider', '$urlRouterProvider',
  function ($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/');

    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .state('about', {
        url: '/about',
        templateUrl: 'views/about.html'

      })
      .state('contact', {
        url: '/contact',
        templateUrl: 'views/contact.html'

      })
      .state('note', {
        url: '/note',
        templateUrl: 'views/note.html',
        controller: 'NotesListCtrl'

      })
      .state('user', {
        url: '/user',
        templateUrl: 'views/user.html',
        controller: 'UserCtrl',
        data: {requireLogin: true}
      })
      .state('store', {
        url: '/store',
        templateUrl: 'views/store.html',
        controller: 'UserCtrl',
        data: {requireLogin: true}
      })
      .state('rank', {
        url: '/rank',
        templateUrl: 'views/rank.html',
        controller: 'UserRankCtrl',
        data: {requireLogin: true}
      })
      .state('logout', {
        url: '/logout',
        controller: 'LogoutCtrl',
        data: {requireLogin: true}
      })
      .state('new_note', {
        url: '/new_note',
        templateUrl: 'views/new_note.html',
        controller: 'NoteAddCtrl',
        data: {requireLogin: true}
      })
      .state('login', {
        url: '/login',
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl'
      });


  }
]);

app.run(function ($rootScope, $state, $location, Session) {
  $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState) {


    // NOT authenticated - wants any private stuff

    var shouldLogin = toState.data !== undefined && toState.data.requireLogin && !Session.user;
    if (shouldLogin) {
      $state.go('login');
      event.preventDefault();

    }


  });
});
