

routelessServices.factory('CheckPoint', ['$resource', 'rlConfig',
  function($resource, rlConfig){
    rlConfig = {backend: ''};
    return $resource(rlConfig.backend+'api_1_0/checkpoints/:id', {id:'@id'}, {
        query: {method:'GET', isArray:false},
        update: {method: 'PUT'}  
    });
  }]);

//routelessServices.factory('CheckPointLog', ['$resource', 'rlConfig',
//  function($resource, rlConfig){
//    rlConfig = {backend: ''};
//    return $resource(rlConfig.backend+'api_1_0/check_point_log/:id', {id:'@id'}, {
//        query: {method:'GET', isArray:false},
//        update: {method: 'PUT'}  
//    });
//  }]);
//

routelessServices.factory('LogPoint', ['$resource', 'TokenService', 'rlConfig',
  function($resource, TokenService, rlConfig){
    return $resource(rlConfig.backend+'api_1_0/logpoints/:id', {id:'@id'}, {
        save: {
          method: 'POST',
          headers: TokenService.authHeaders
        }
    });
  }]);

