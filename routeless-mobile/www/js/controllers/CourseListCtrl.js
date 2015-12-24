
routelessControllers.controller('CourseListCtrl', ['$scope', 'Course', '$state', 
  function($scope, Course, $state) {
    $scope.courses = Course.query();
    $scope.orderProp = 'id';  
    
    $scope.loadCourse = function(id) {
      console.log(id);
      $state.go('app.map', {id: id});
    };
  }]);