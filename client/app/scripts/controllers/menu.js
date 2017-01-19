/**
 * Created by gxu on 11/22/16.
 */
angular
  .module('aroneApp')
  .controller('MenuCtrl', //[
    //'$scope', 'Menus', 'Session',
    //function($scope, menus, session){
    function($scope, Menus, Session){
      //if ($scope.currentUser == null)
      if(Session.user == null) {
        $scope.menus = Menus.default_menu;
      }
      //else if($scope.currentUser.name != 'admin')
      else if(Session.user.name != 'admin')
        $scope.menus = Menus.user_menu;
      else {
        $scope.menus = Menus.admin_menu;
      }
    }
  );
