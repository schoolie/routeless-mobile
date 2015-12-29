routelessControllers.controller('EventDetailCtrl',
  [ '$scope',
    '$cordovaGeolocation',
    '$stateParams',
    'leafletMarkerEvents',
    'TokenService',
    'Event',
    'Course',
    
    function(
      $scope,
      $cordovaGeolocation,
      $stateParams,
      leafletMarkerEvents,
      TokenService,
      Event,
      Course) {
            
        var cp_idx_from_id = function(id) {
//            var found_cp;
          var cp_idx = 0;
          var found_idx = 0;
          $scope.event.course.check_points.forEach(function(cp) {
            if (cp.id === id) {
//                found_cp = cp;
              found_idx = cp_idx;
            }
            cp_idx++;
          });
          console.log(found_idx);
          return found_idx;
        };
        /**
         * Once state loaded, put map on scope.
         */
        $scope.$on("$stateChangeSuccess", function() {

          angular.extend($scope, {lfevents: {
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


          
          var active_id;
          
          var markerEvents = leafletMarkerEvents.getAvailableEvents();
          for (var k in markerEvents){
              var eventName = 'leafletDirectiveMarker.myMap.' + markerEvents[k];
              $scope.$on(eventName, function(event, args){
                if (event.name === 'leafletDirectiveMarker.myMap.mouseout') {
//                  $scope.eventDetected = event.name;
                  active_id = args.leafletEvent.target.options.id;
                  $scope.active_marker = $scope.event.course.check_points[cp_idx_from_id(active_id)];
                  $scope.checkDistance(active_id);
                }
              });
          }
          
          $scope.event = Event.query({id: $stateParams.eventId}, success=function() {
            console.log('success');
            var course = Course.query({id: $scope.event.course.id}, success=function(){
              $scope.event.course = course;
            });
          });          
          
        });
            
        $scope.checkDistance = function(active_id) {

          $cordovaGeolocation
            .getCurrentPosition({enableHighAccuracy:true})
            .then(function (position) {
              target = $scope.event.course.check_points[cp_idx_from_id(active_id)];
              targLatLng = L.latLng(target.lat, target.lng);
              currLatLng = L.latLng(position.coords.latitude, position.coords.longitude);
              distance = currLatLng.distanceTo(targLatLng);
              console.log(distance);
              $scope.event.course.check_points[cp_idx_from_id(active_id)].distance = distance;
            }, function(err) {
              // error
              console.log("Location error!");
              console.log(err);
            });

        };
      }]);