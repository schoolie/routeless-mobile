/* Resource that Processes Loads/Saves Event Objects */


routelessServices.factory('Event', ['$resource', 'TokenService', 'rlConfig',
  function($resource, TokenService, rlConfig){
    return $resource(rlConfig.backend+'api_1_0/events/:id', {id:'@id'}, {
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
            if (!('num_results' in data)) {
              data.center = {
                lat: parseFloat(data.course.lat, 10) || 40.4279,
                lng: parseFloat(data.course.lng, 10) || -86.9188,
                zoom: parseInt(data.course.zoom) || 14
              };
            }
            console.log(data);
            return data;
          } 
        }
    });
  }]);
