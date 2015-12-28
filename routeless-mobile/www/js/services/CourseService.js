/* Resource that Processes Loads/Saves Course Objects */


routelessServices.factory('Course', ['$resource', 'TokenService', 'rlConfig',
  function($resource, TokenService, rlConfig){
    return $resource(rlConfig.backend+'api_1_0/courses/:id', {id:'@id'}, {
        save: {
          method: 'POST',
          headers: TokenService.authHeaders
        },
        query: {
          method:'GET',
          isArray:false,
          headers: TokenService.authHeaders,
          params: {
            q: '@q'
          },
          transformResponse: function(data) {
            data = JSON.parse(data);
            console.log(data);

            data.center = {
              lat: parseFloat(data.lat, 10) || 40.4279,
              lng: parseFloat(data.lng, 10) || -86.9188,
              zoom: parseInt(data.zoom) || 14
            };
            
            return data;
          }
          
        },
        update: {
          method: 'PUT',
          headers: TokenService.authHeaders,
          transformRequest: function(data) {
            var proc_data = data;
            delete proc_data.autoDiscover;
            delete proc_data.center;
            delete proc_data.markers; //need to make mobile and client handle markers/checkpoints the same way...
            proc_data.check_points.forEach(function(cp){
              delete cp.draggable;
              delete cp.transient; //Strip transient gmaps data for passing to server
              delete cp.$$hashKey; //Strip for passing to server
            });
            return JSON.stringify(proc_data);
          }
        }
    });
  }]);
