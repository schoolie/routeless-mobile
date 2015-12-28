
routelessControllers.controller('EventListCtrl', ['$scope', 'Event', '$state', 
  function($scope, Event, $state) {
    $scope.events = Event.query();
    console.log($scope.events);
    $scope.orderProp = 'id';  
    
    $scope.loadEvent= function(id) {
      console.log(id);
      $state.go('tabs.events', {id: id});
    };
  }]);