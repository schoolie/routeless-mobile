routelessServices.factory('AuthService', 
  ['$http', 
    'TokenService',
    'User',
    'rlConfig',
    function ($http, TokenService, User, rlConfig) {

       return {
          signup: function(data, success, error) {
            console.log('signup');
            
            user = new User({
              username: data.username,
              email: data.email,
              password: data.password
            });
            user.$save().then(success, error);
          },
          login: function (data, success, error) {
              $http.post(rlConfig.backend + 'auth', data).success(function(res) {
                TokenService.setToken(res.access_token);
                success(res);
              }).error(error);
          },
          logout: function (success) {
              TokenService.clearToken();
              success();
          }          
       };
   }]);