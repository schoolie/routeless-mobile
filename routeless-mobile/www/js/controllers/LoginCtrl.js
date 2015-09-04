
routelessControllers.controller('LoginCtrl',
['$scope',
  '$localStorage',
  'AuthService',
  function LoginController($scope, $localStorage, AuthService) {
    $scope.user = {
      id: 1
    };
    
    $scope.$storage = $localStorage;
    
    function successAuth(res) {
      console.log('Logged In');
      window.location = "#/courses";
    }
    
    $scope.login = function() {
      var formData = {
        username: $scope.user.username,
        password: $scope.user.password
      };

      AuthService.login(formData, successAuth, function() {
        $scope.error = 'Invalid credentials.';
      });
    };
  }]);