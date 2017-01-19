/**
 * Created by gxu on 11/22/16.
 */
/* Define the Repository that interfaces with Restangular */
var app = angular.module('aroneApp');

app.factory('Note', ['Restangular', 'Session',
  function (Restangular, session) {


    var noteService = {};

    noteService.getNotifications = function (skip, limit) {
      return Restangular.all('notes').getList({skip:skip, limit:limit});
    };

    noteService.addNote = function (note) {
      return Restangular.all('notes').post(note, {}, {'x-user-token': session.token});
    };


    return noteService;
  }
]);
