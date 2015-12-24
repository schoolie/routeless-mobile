
routelessControllers.controller('SignInCtrl',
['$scope',
  '$localStorage',
  '$state',
  'AuthService',
  function LoginController($scope, $localStorage, $state, AuthService) {
    
    $scope.user = {
      id: 1
    };
    
    $scope.$storage = $localStorage;
    
    function successAuth(res) {
      console.log('Sign-In', $scope.user);
      $scope.error = '';
      $state.go('tabs.home');
    }
    
    function errorAuth(res) {
      console.log('Invalid Sign-In', $scope.user);
      $scope.error = 'Invalid credentials.';
      $state.go('tabs.sign-in');
    }
    
    $scope.signIn = function() {
      var formData = {
        username: $scope.user.username,
        password: $scope.user.password
      };

      AuthService.login(formData, successAuth, errorAuth);
    };
  }]);


routelessControllers.controller('HomeTabCtrl', function($scope) {
  console.log('HomeTabCtrl');
});