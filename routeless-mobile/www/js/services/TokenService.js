routelessServices.factory('TokenService', 
  ['$http', 
    '$localStorage',
    'rlConfig',
    function ($http, $localStorage, User, rlConfig) {
       function urlBase64Decode(str) {
           var output = str.replace('-', '+').replace('_', '/');
           switch (output.length % 4) {
               case 0:
                   break;
               case 2:
                   output += '==';
                   break;
               case 3:
                   output += '=';
                   break;
               default:
                   throw 'Illegal base64url string!';
           }
           return window.atob(output);
       }

       function getClaimsFromToken() {
           var token = $localStorage.token;
           var user = {};
           if (typeof token !== 'undefined') {
               var encoded = token.split('.')[1];
               user = JSON.parse(urlBase64Decode(encoded));
           }
           return user;
       }

       var tokenClaims = getClaimsFromToken();

       return {
          setToken: function(token) {
              $localStorage.token = token;
          },
          clearToken: function() {
              tokenClaims = {};
              delete $localStorage.token;
          },
          getAuthUser: function () {
              return getClaimsFromToken();
          },
          getToken: function() {
              var token = $localStorage.token;
              return token;
          },
          authHeaders: {'Authorization': function() {
              token = $localStorage.token;
              if (typeof token !== 'undefined') {
                 return 'JWT ' + token;
              }
              else {
                 return null;
              }
            }
          }
          
       };
   }]);