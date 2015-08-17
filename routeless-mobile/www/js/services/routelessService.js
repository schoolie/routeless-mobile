'use strict';

/* Services */

var routelessServices = angular.module('routelessServices', ['ngResource']);

routelessServices.factory('User', ['$resource', 'rlConfig',
  function($resource, rlConfig){
    return $resource(rlConfig.backend+'api_1_0/users_/:id', {id:'@id'}, {
        query: {method:'GET', isArray:false}
    });
  }]);

routelessServices.factory('Course', ['$resource', 'rlConfig',
  function($resource, rlConfig){
    return $resource(rlConfig.backend+'api_1_0/courses/:id', {id:'@id'}, {
        query: {
          method:'GET',
          isArray:false,
          transformResponse: function(data) {
            data = JSON.parse(data);
            data.center = {
              lat: parseFloat(data.lat, 10) || 40.4279,
              lng: parseFloat(data.lng, 10) || -86.9188,
              zoom: parseInt(data.zoom) || 14
            };
            
            data.markers = {};
            if('check_points' in data){
              data.check_points.forEach(function(cp){
                cp.draggable = true;
                data.markers[cp.id] = {
                  id: cp.id,
                  lat: cp.lat,
                  lng: cp.lng,
                  title: cp.id,
                  message: cp.message
                };
              });
            }
            return data;
          }
          
        },
        update: {
          method: 'PUT',
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

routelessServices.factory('CheckPoint', ['$resource', 'rlConfig',
  function($resource, rlConfig){
    rlConfig = {backend: ''};
    return $resource(rlConfig.backend+'api_1_0/checkpoints/:id', {id:'@id'}, {
        query: {method:'GET', isArray:false},
        update: {method: 'PUT'}  
    });
  }]);
