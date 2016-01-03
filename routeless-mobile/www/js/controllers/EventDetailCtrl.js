routelessControllers.controller('EventDetailCtrl',
  [ '$scope',
    '$cordovaGeolocation',
    '$stateParams',
    'leafletMarkerEvents',
    'TokenService',
    'Event',
    'Course',
    'LogPoint',
    
    function(
      $scope,
      $cordovaGeolocation,
      $stateParams,
      leafletMarkerEvents,
      TokenService,
      Event,
      Course,
      LogPoint) {
            
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
          return found_idx;
        };
        
        // Checkpoint click callback
        var layerClickCallback = function(e) {
          var active_id = e.target.feature.properties.id;
          active_idx = cp_idx_from_id(active_id);
          $scope.active_marker = $scope.event.course.check_points[active_idx];
          $scope.$apply();
          $scope.createLogPoint(active_idx);
        };
        
        // Function to bind click callbacks to GeoJSON points
        var onEachFeature = function(feature, layer) {
          //bind click
          layer.on('click', layerClickCallback);
        };

        /**
         * Once state loaded, put map on scope.
         */
        $scope.$on("$stateChangeSuccess", function() {
          
          angular.extend($scope, {
            active_marker: {id: 'test'},
            lfevents: {
              map: {
                  enable: ['click'],
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
              },
              overlays: {
                range_circles: {
                  name:'Range Circles',
                  type: 'geoJSONShape',
                  data: {
                    type: "FeatureCollection",
                    features: []
                  },
                  visible: true,
                  layerOptions: {
                    pointToLayer: function (geojson, latlng) {
                      return L.circle(latlng, 50, {
                        color: '#0f0',
                        weight: 2,
                        fill: false,
                        clickable: false
                      });
                    }
                  }
                },
                
                checkpoints: {
                  name:'Check Points',
                  type: 'geoJSONShape',
                  data: {
                    type: "FeatureCollection",
                    features: []
                  },
                  visible: true,
                  layerOptions: {
                    pointToLayer: function (geojson, latlng) {
                      return L.circleMarker(latlng, {
                        color: '#33f',
                        weight: 2,
                        fillOpacity: 1
                      });
                    },
                    onEachFeature: onEachFeature
                  }
                }
              }
            }      
          });
          
          console.log($scope);
          
          var active_id;
          var active_idx;
          
//          var markerEvents = leafletMarkerEvents.getAvailableEvents();
//          for (var k in markerEvents){
//              var eventName = 'leafletDirectiveMarker.myMap.' + markerEvents[k];
//              $scope.$on(eventName, logPointCallback);
//          }
          
          $scope.event = Event.query({id: $stateParams.eventId}, success=function() {
            console.log('success');
//            $scope.layers.overlays.checkpoints.data.features.geometry = 
            var features = [];
            
            $scope.event.course.check_points.forEach(function(cp) {
              
              $scope.layers.overlays.range_circles.data.features.push({
                type: "Feature",
                properties: {
                  title: cp.title,
                  description: cp.message
                },
                geometry: {
                  type: "Point",
                  coordinates: [cp.lng, cp.lat]
                }
              });

              $scope.layers.overlays.checkpoints.data.features.push({
                type: "Feature",
                properties: {
                  id: cp.id,
                  title: cp.title,
                  description: cp.message
                },
                geometry: {
                  type: "Point",
                  coordinates: [cp.lng, cp.lat]
                }
              });
            });
            
            console.log($scope.event);
            
          });          
          
        });
            
        $scope.createLogPoint = function(active_idx) {

          $cordovaGeolocation
            .getCurrentPosition({enableHighAccuracy:true})
            .then(function (position) {
              target = $scope.event.course.check_points[active_idx];
      
              targLatLng = L.latLng(target.lat, target.lng);
              currLatLng = L.latLng(position.coords.latitude, position.coords.longitude);
              
              var distance = currLatLng.distanceTo(targLatLng);
              console.log(distance);
              
              var log_point = new LogPoint({
                check_point_log_id: $scope.event.check_point_logs[active_idx].id,
                lat: position.coords.latitude,
                lng: position.coords.longitude,
                distance: distance,
                type: 'found'
              });
              log_point.$save();

              $scope.event.check_point_logs[active_idx].log_points.push(log_point);
              
            }, function(err) {
              // error
              console.log("Location error!");
              console.log(err);
            });

        };
      }]);