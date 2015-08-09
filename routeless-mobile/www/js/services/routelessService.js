'use strict';

/* Services */

var routelessServices = angular.module('routelessServices', ['ngResource']);

routelessServices.factory('User', ['$resource',
  function($resource){
    return $resource('http://localhost:5000/api_1_0/users_/:id', {id:'@id'}, {
        query: {method:'GET', isArray:false}
    });
  }]);

routelessServices.factory('Course', ['$resource',
  function($resource){
    return $resource('http://localhost:5000/api_1_0/courses/:id', {id:'@id'}, {
        query: {
          method:'GET',
          isArray:false,
          transformResponse: function(data) {
            data = JSON.parse(data);
            data.lat = parseFloat(data.lat, 10) || 40.4279;
            data.lng = parseFloat(data.lng, 10) || -86.9188;
            data.zoom = parseInt(data.zoom) || 14;
            
            if('check_points' in data){
              data.check_points.forEach(function(cp){
                cp.draggable = true;
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

routelessServices.factory('CheckPoint', ['$resource',
  function($resource){
    return $resource('http://localhost:5000/api_1_0/checkpoints/:id', {id:'@id'}, {
        query: {method:'GET', isArray:false},
        update: {method: 'PUT'}  
    });
  }]);
