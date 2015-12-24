
routelessControllers.controller('CourseListCtrl', ['$scope', 'Course', '$state', 
  function($scope, Course, $state) {
    $scope.courses = Course.query();
    $scope.orderProp = 'id';  
    
    $scope.loadCourse = function(id) {
      console.log(id);
      $state.go('tabs.courses', {id: id});
    };
  }]);