'use strict';

var app = angular.module('aroneApp');

/* Here the controllers are defines */



app.controller('NotesListCtrl', function ($scope, Note) {
  $scope.title = 'Notifications';
  $scope.notes = [];

  $scope.pageSize = 10;
  Note.getNotifications(0,10).then(function(notifications){
    for(var i=0; i<notifications.length; i++){
      var noteDate = new Date(notifications[i].date);
      notifications[i].date = noteDate.toUTCString();
    }
    $scope.notes = notifications;
  }, function (response) {
    console.log('Get notifications error with status code', response.status);
  });


  $scope.currentPage = 1;

  $scope.nextPage = function(){
    if ($scope.notes.length < $scope.pageSize){
      return;
    }

    Note.getNotifications($scope.currentPage*$scope.pageSize, $scope.pageSize).then(function (notifications) {
      $scope.notes = notifications;
      $scope.currentPage++;
    }, function (response) {
      console.log('Error getting notifications with status code:', response.status);
    });
  };
  $scope.prevPage = function(){
    if($scope.pageSize <= 1 ){
      return;
    }
    $scope.currentPage--;
    Note.getNotifications(($scope.currentPage-1)*$scope.pageSize, $scope.pageSize).then(function (notifications) {
      $scope.notes = notifications;
    }, function (response) {
      console.log('Error getting notifications with status code:', response.status);
    });
  };


});



app.controller('NoteAddCtrl', function ($scope, $state, Note) {
  $scope.note = "";
  $scope.errorMsg = "";

  $scope.createNote = function () {
    if ($scope.note == ""){
      $scope.errorMsg = "No content";
      return;
    }
    Note.addNote({note: $scope.note}).then(function (data) {
      console.log("note added: ", data);
      $state.go('note');
    }, function (response) {
      console.log("Failed to add note with status code ", response.status);
      $scope.errorMsg = "Failed to add note";
    });
  };
});

/* Below are the states that are used */
app.config(['$stateProvider',
  function ($stateProvider) {

    $stateProvider
    .state('notes', {
      abstract: true,
      url: '/notes',
      templateUrl: 'views/notes/main.html'
    })

    .state('notes.list', {
      url: '',
      templateUrl: 'views/notes/list.html',
      controller: 'NotesListCtrl'
    })

    .state('notes.add', {
      url: '/add',
      templateUrl: 'views/notes/edit.html',
      controller: 'NotesAddCtrl'
    })

    .state('notes.edit', {
      url: '/edit/{id}',
      templateUrl: 'views/notes/edit.html',
      controller: 'NotesEditCtrl'
    })

    .state('notes.item', {
      url: '/{id}',
      templateUrl: 'views/notes/item.html',
      controller: 'NotesItemCtrl'
    });
  }
]);
