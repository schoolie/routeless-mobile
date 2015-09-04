routelessControllers.controller('MapCtrl',
  [ '$scope',
    '$cordovaGeolocation',
    '$stateParams',
    '$ionicModal',
    '$ionicPopup',
    '$localStorage',
    'LocationsService',
    'InstructionsService',
    'Course',
    'rlConfig',
    'TokenService',
    
    function(
      $scope,
      $cordovaGeolocation,
      $stateParams,
      $ionicModal,
      $ionicPopup,
      $localStorage,
      LocationsService,
      InstructionsService,
      Course,
      rlConfig,
      TokenService
      ) {
      
      console.log(TokenService);
      
      $scope.$storage = $localStorage;

      $scope.$watch(function() {
        return $scope.$storage.token;
      }, function(newVal, oldVal) {
        $scope.authUser = TokenService.getAuthUser();
      });
      
      /**
       * Once state loaded, get put map on scope.
       */
      $scope.$on("$stateChangeSuccess", function() {

        $scope.locations = LocationsService.savedLocations;
        $scope.newLocation;
        
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
        
        $scope.courses = Course.query();
        $scope.course = Course.query({id: 1});
        

//        if(!InstructionsService.instructions.newLocations.seen) {
//
//          var instructionsPopup = $ionicPopup.alert({
//            title: 'Add Locations',
//            template: InstructionsService.instructions.newLocations.text
//          });
//          instructionsPopup.then(function(res) {
//            InstructionsService.instructions.newLocations.seen = true;
//            });
//        }

      });

      var Location = function() {
        if ( !(this instanceof Location) ) return new Location();
        this.lat  = "";
        this.lng  = "";
        this.name = "";
      };

      $ionicModal.fromTemplateUrl('templates/addLocation.html', {
        scope: $scope,
        animation: 'slide-in-up'
      }).then(function(modal) {
          $scope.modal = modal;
        });

      /**
       * Detect user long-pressing on map to add new location
       */
      $scope.$on('leafletDirectiveMap.contextmenu', function(event, locationEvent){
        $scope.newLocation = new Location();
        $scope.newLocation.lat = locationEvent.leafletEvent.latlng.lat;
        $scope.newLocation.lng = locationEvent.leafletEvent.latlng.lng;
        $scope.modal.show();
      });

      $scope.saveLocation = function() {
        LocationsService.savedLocations.push($scope.newLocation);
        $scope.modal.hide();
        $scope.goTo(LocationsService.savedLocations.length - 1);
      };

      $scope.loadCourse = function(courseId) {       
        console.log('changing course');
        console.log(courseId);
        $scope.course = Course.query({id: courseId}, function(data) {          
          $scope.center = {
            lat: data.lat,
            lng: data.lng,
            zoom: data.zoom
          };
          window.location = "#/map";
        });
        
        console.log($scope.center);
      };
      
      /**
       * Center map on specific saved location
       * @param locationKey
       */
      $scope.goTo = function(locationKey) {

        var location = LocationsService.savedLocations[locationKey];

        $scope.map.center  = {
          lat : location.lat,
          lng : location.lng,
          zoom : 12
        };

        $scope.map.markers[locationKey] = {
          lat:location.lat,
          lng:location.lng,
          message: location.name,
          focus: true,
          draggable: false
        };

      };

      /**
       * Center map on user's current position
       */
      $scope.locate = function(){

        $cordovaGeolocation
          .getCurrentPosition()
          .then(function (position) {
            console.log(position);
            $scope.course.center.lat  = position.coords.latitude;
            $scope.course.center.lng = position.coords.longitude;

            $scope.course.markers['now'] = {
              lat:position.coords.latitude,
              lng:position.coords.longitude,
//              message: "You Are Here",
//              focus: true,
//              draggable: false
            };

          }, function(err) {
            // error
            console.log("Location error!");
            console.log(err);
          });

      };
      
      $scope.checkDistance = function(cpId){

        $cordovaGeolocation
          .getCurrentPosition({enableHighAccuracy:true})
          .then(function (position) {
            target = $scope.course.markers[cpId];
            targLatLng = L.latLng(target.lat, target.lng);
            currLatLng = L.latLng(position.coords.latitude, position.coords.longitude);
            distance = currLatLng.distanceTo(targLatLng);
            console.log(distance);
            $scope.course.markers[cpId].distance = distance;
        }, function(err) {
            // error
            console.log("Location error!");
            console.log(err);
          });

      };

    }]);