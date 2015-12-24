
routelessControllers.controller('TabCtrl',
['$scope',
  '$localStorage',
  '$state',
  'AuthService',

  function SignInController($scope, $localStorage, $state, AuthService) {
    
    $scope.signOut = function(){
      AuthService.logout(function(){});
      $state.go('signin');
    };
  }]);
