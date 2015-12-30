'use strict';

/* Services */

var routelessServices = angular.module('routelessServices', ['ngResource']);

routelessServices.factory('User', ['$resource', 'rlConfig',
  function($resource, rlConfig){
    return $resource(rlConfig.backend+'api_1_0/users_/:id', {id:'@id'}, {
        query: {method:'GET', isArray:false}
    });
  }]);
