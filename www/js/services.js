angular.module('solfit.services', [])

//.factory('Auth',function() { return { isLoggedIn : false}; })
.factory('AuthenticationService',function() {
  return {
    login: function(credentials) {
      console.log(credentials);
    },
    logout: function() {

    },
    signup: function() {

    },
    isLoggedIn: false
  }
})
.factory('User',function($http,PARSE_CREDENTIALS){
  return {
    signup: function() {
      return $http.get('https://api.parse.com/1/users',{
        params:{

        },
        headers:{
          'X-Parse-Application-Id': PARSE_CREDENTIALS.APP_ID,
          'X-Parse-REST-API-Key':PARSE_CREDENTIALS.REST_API_KEY,
        }
      });
    },
    login: function() {

    },
    logout: function() {

    }
  };
}).value('PARSE_CREDENTIALS',{
    APP_ID: 'CjxuaHciI7gfI9dheTCaDDmRJmyW8jnS4XO4zhFj',
    REST_API_KEY:'RO2WVdpkGRQF73ahQSRh95x9DmOzhXxbkOGDdqDt'
});
