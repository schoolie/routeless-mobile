routelessControllers.controller('EventCtrl', ['$scope', 'Event',
  function($scope, Event) {
    $scope.event = new Event({});
    
    $scope.submit = function() {
      $scope.user.$save($scope.user, function(response) {
        console.log(response);
      });
    };
  }]);