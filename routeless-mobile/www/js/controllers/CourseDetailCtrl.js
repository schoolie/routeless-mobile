routelessControllers.controller('CourseDetailCtrl',
  [ '$scope',
    '$cordovaGeolocation',
    '$stateParams',
    'leafletMarkerEvents',
    'TokenService',
    'Course',
    'Event',
    
    function(
      $scope,
      $cordovaGeolocation,
      $stateParams,
      leafletMarkerEvents,
      TokenService,
      Course,
      Event) {
            
      
        /**
         * Once state loaded, put map on scope.
         */
        $scope.$on("$stateChangeSuccess", function() {

          angular.extend($scope, {events: {
              map: {
                  enable: [],
                  logic: 'emit'
              },
              markers: {
                  enable: leafletMarkerEvents.getAvailableEvents(),
              }
            },
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

          var cp_from_id = function(id) {
            var found_cp;
            $scope.course.check_points.forEach(function(cp) {
              var cp = cp;
              if (cp.id === id) {
                found_cp = cp;
              }
            });
            return found_cp;
          };
          
          var active_id;
          
          var markerEvents = leafletMarkerEvents.getAvailableEvents();
          for (var k in markerEvents){
              var eventName = 'leafletDirectiveMarker.myMap.' + markerEvents[k];
              $scope.$on(eventName, function(event, args){
                if (event.name === 'leafletDirectiveMarker.myMap.click') {
//                  $scope.eventDetected = event.name;
                  active_id = args.leafletEvent.target.options.id;
                  $scope.active_marker = cp_from_id(active_id);
                }
              });
          }
          
          $scope.course = Course.query({id: $stateParams.courseId}, success=function() {
            console.log('success');
          });          
          
        });
        
        $scope.createEvent = function() {
          var current_user = TokenService.getAuthUser();
          console.log(TokenService.authHeaders);
          
          event = new Event({         
            user_id: current_user.id,
            course_id: $scope.course.id
          });          
          event.$save();
        };
      }]);