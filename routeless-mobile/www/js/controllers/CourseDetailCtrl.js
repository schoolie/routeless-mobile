routelessControllers.controller('CourseDetailCtrl',
  [ '$scope',
    '$cordovaGeolocation',
    '$stateParams',
    'Course',
    
    function(
      $scope,
      $cordovaGeolocation,
      $stateParams,
      Course) {
            
      
        /**
         * Once state loaded, get put map on scope.
         */
        $scope.$on("$stateChangeSuccess", function() {

          angular.extend($scope, {events: {},
            layers: {
              baselayers: {
                  googleTerrain: {
                      name: 'Google Terrain',
                      layerType: 'TERRAIN',
                      type: 'google'
                  },
                  googleHybrid: {
                          name: 'Google Hybrid',
                          layerType: 'HYBRID',
                          type: 'google'
                      },
                  googleRoadmap: {
                      name: 'Google Streets',
                      layerType: 'ROADMAP',
                      type: 'google'
                  },
                  osm: {
                    name: 'OpenStreetMap',
                    url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                    type: 'xyz'
                  },
                  caltopo: {
                    name: 'CalTopo',
                    url: "http://s3-us-west-1.amazonaws.com/caltopo/topo/{z}/{x}/{y}.png?v=1",
                    type: 'xyz'
                  }
              }
            }
          });

          $scope.center = {};
            $scope.course = Course.query({id: $stateParams.courseId});
          });
      }]);