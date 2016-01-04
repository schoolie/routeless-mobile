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


        var createGeoJSON = function(name, marker_func) {
          var GeoJSON = {
                  name: name,
                  type: 'geoJSONShape',
                  data: {
                    type: "FeatureCollection",
                    features: []
                  },
                  visible: true,
                  layerOptions: {
                    pointToLayer: function (feature, latlng) {
                      return marker_func(feature, latlng);
                    },
                    onEachFeature: onEachFeature
                  }
                };
          return GeoJSON;
        };
        
        var addLogPoint = function(lp) {
                
          var color = '#f00';
          if (lp.type === 'found') {
            color = '#00f';
          }
          else if (lp.type === 'near') {
            color = '#ffff00'
          }

          var point_data = {
            type: "Feature",
            properties: {
              distance: lp.distance,
              color: color
            },
            geometry: {
              type: "Point",
              coordinates: [lp.lng, lp.lat]
            }
          };

          $scope.layers.overlays.logpoints.data.features.push(point_data);


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
                
                found_circles: createGeoJSON('Found Circles', function(feature, latlng) {
                    return L.circle(latlng, feature.properties.found_distance, {
                      color: '#0f0',
                      weight: 2,
                      fill: false,
                      clickable: false
                    });
                  }
                ),                
                near_circles: createGeoJSON('Near Circles', function(feature, latlng) {
                    return L.circle(latlng, feature.properties.near_distance, {
                      color: '#ffff00',
                      weight: 2,
                      fill: false,
                      clickable: false
                    });
                  }
                ),                
                checkpoints: createGeoJSON('Check Points', function(feature, latlng) {
                    return L.circleMarker(latlng, {
                      color: '#33f',
                      weight: 2,
                      fillOpacity: 1
                    });
                  }
                ),                
                logpoints: createGeoJSON('Log Points', function(feature, latlng) {
                    return L.circleMarker(latlng, {
                      color: feature.properties.color,
                      weight: 2,
                      radius: 5,
                      fillOpacity: 1
                    });
                  }
                ),                    
                labels: createGeoJSON('Labels', function(feature, latlng) {
                  return L.marker(latlng, {
                        color: '#33f',
                        weight: 2,
                        fillOpacity: 1,
                        icon: L.divIcon({
                          className: 'label',
                          html: feature.properties.title,
                          iconSize: [50, 40]
                        })
                      });
                    }
                )                
              }
            }      
          });
          
          
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
            
            // Add Check Point info to GeoJSON Layers
            $scope.event.course.check_points.forEach(function(cp) {
              
              var point_data = {
                type: "Feature",
                properties: {
                  title: cp.title,
                  description: cp.message,
                  near_distance: cp.near_distance,
                  found_distance: cp.found_distance
                },
                geometry: {
                  type: "Point",
                  coordinates: [cp.lng, cp.lat]
                }
              };
              
              $scope.layers.overlays.found_circles.data.features.push(point_data);
              $scope.layers.overlays.near_circles.data.features.push(point_data);
              $scope.layers.overlays.checkpoints.data.features.push(point_data);
              $scope.layers.overlays.labels.data.features.push(point_data);
              
            });
            
            $scope.event.check_point_logs.forEach(function(cpl) {
              cpl.log_points.forEach(addLogPoint);
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
                            
              $scope.markers = [currLatLng];
              
              var distance = currLatLng.distanceTo(targLatLng);
              console.log(distance);
              
              var type = '';
              var found = 0;
              if (distance <= target.found_distance) {
                type = 'found';
                found = 1;
              }
              else if (distance <= target.near_distance) {
                type = 'near';
              }
              console.log(type);
              var log_point = new LogPoint({
                check_point_log_id: $scope.event.check_point_logs[active_idx].id,
                lat: position.coords.latitude,
                lng: position.coords.longitude,
                distance: distance,
                type: type
              });
              log_point.$save();
              
              addLogPoint(log_point);

              $scope.event.check_point_logs[active_idx].log_points.push(log_point);
              
            }, function(err) {
              // error
              console.log("Location error!");
              console.log(err);
            });
        };
      }]);