'use strict';

/* Services */

var routelessServices = angular.module('routelessServices', ['ngResource']);

routelessServices.factory('User', ['$resource', 'rlConfig',
  function($resource, rlConfig){
    return $resource(rlConfig.backend+'api_1_0/users_/:id', {id:'@id'}, {
        query: {method:'GET', isArray:false}
    });
  }]);

routelessServices.factory('CheckPoint', ['$resource', 'rlConfig',
  function($resource, rlConfig){
    rlConfig = {backend: ''};
    return $resource(rlConfig.backend+'api_1_0/checkpoints/:id', {id:'@id'}, {
        query: {method:'GET', isArray:false},
        update: {method: 'PUT'}  
    });
  }]);

routelessServices.factory('Event', ['$resource', 'rlConfig',
  function($resource, rlConfig){
    return $resource(rlConfig.backend+'api_1_0/events/:id', {id:'@id'}, {
        query: {
          method:'GET',
          isArray:false,
          transformResponse: function(data) {
            data = JSON.parse(data);
            return data;
          }
          
        },
        update: {
          method: 'PUT',
          transformRequest: function(data) {
            var data = data;
            return JSON.stringify(data);
          }
        }
    });
  }]);
