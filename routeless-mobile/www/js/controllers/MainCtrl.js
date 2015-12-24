var routelessControllers = angular.module('routelessControllers', []);

routelessControllers.controller('MainCtrl',
  [ '$scope',
    '$stateParams',
    '$ionicModal',
    '$ionicPopup',
    '$localStorage',
    'TokenService',
    
    function(
      $scope,
      $stateParams,
      $ionicModal,
      $ionicPopup,
      $localStorage,
      TokenService) {
        
        
      $scope.$storage = $localStorage;

      $scope.$watch(function() {
        return $scope.$storage.token;
      }, function(newVal, oldVal) {
        $scope.authUser = TokenService.getAuthUser();
      });
      
      
      
      }]);