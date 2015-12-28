routelessControllers.controller('EventDetailCtrl',
  [ '$scope',
    '$cordovaGeolocation',
    '$stateParams',
    'leafletMarkerEvents',
    'TokenService',
    'Event',
    
    function(
      $scope,
      $cordovaGeolocation,
      $stateParams,
      leafletMarkerEvents,
      TokenService,
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

          var active_id;
          
          var markerEvents = leafletMarkerEvents.getAvailableEvents();
          for (var k in markerEvents){
              var eventName = 'leafletDirectiveMarker.myMap.' + markerEvents[k];
              $scope.$on(eventName, function(event, args){
                if (event.name === 'leafletDirectiveMarker.myMap.mouseout') {
//                  $scope.eventDetected = event.name;
                  active_id = args.leafletEvent.target.options.id;
                  $scope.active_marker = $scope.event.course.markers[active_id];
                  $scope.checkDistance(active_id);
                }
              });
          }
          
          $scope.event = Event.query({id: $stateParams.eventId}, success=function() {
            console.log('success');
          });          
          
        });
            
        $scope.checkDistance = function(active_id) {

          $cordovaGeolocation
            .getCurrentPosition({enableHighAccuracy:true})
            .then(function (position) {
              target = $scope.event.course.markers[active_id];
              targLatLng = L.latLng(target.lat, target.lng);
              currLatLng = L.latLng(position.coords.latitude, position.coords.longitude);
              distance = currLatLng.distanceTo(targLatLng);
              console.log(distance);
              $scope.event.course.markers[active_id].distance = distance;
            }, function(err) {
              // error
              console.log("Location error!");
              console.log(err);
            });

        };
      }]);