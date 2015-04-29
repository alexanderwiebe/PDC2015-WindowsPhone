angular.module('solfit.services', [])
.factory('persistanceService', function($http, $cookies, PARSE_CREDENTIALS){
  return {
    /**
     * uses the 'currentSession' cookie to get current user
     * @returns {current user}
     */
    validate: function(){
      return $http.get('https://api.parse.com/1/users/me',{
        headers:{
          'X-Parse-Application-Id': PARSE_CREDENTIALS.APP_ID,
          'X-Parse-REST-API-Key':PARSE_CREDENTIALS.REST_API_KEY,
          'X-Parse-Session-Token':$cookies['currentSession']
        }
      }).success(function(response){
        if(response.error){
          return false;
        }
      }).error(function(response){
        return false;
      });
    },
    users: function(withThisQuery, withThisOrder, withThisLimit){
      return $http({
        method:'get',
        url:'https://api.parse.com/1/users/',
        params:{
          'where':withThisQuery,
          'order':(withThisOrder||'-updatedAt'),
          'limit':(withThisLimit||0)
        },
        headers:{
          'X-Parse-Application-Id': PARSE_CREDENTIALS.APP_ID,
          'X-Parse-REST-API-Key':PARSE_CREDENTIALS.REST_API_KEY
        }
      }).success(function(response){
        if(response.error){
          return false;
        }
      }).error(function(response){
        return false;
      });
    },
    save: function(saveThis, saveItHere, withUserObjectID){
      saveThis['userId'] = saveThis['userId'] || withUserObjectID;
      return $http({
        method:'post',
        url:'https://api.parse.com/1/classes/'+saveItHere,
        headers:{
          'X-Parse-Application-Id': PARSE_CREDENTIALS.APP_ID,
          'X-Parse-REST-API-Key':PARSE_CREDENTIALS.REST_API_KEY,
          'Content-Type': 'application/json'
        },
        data:saveThis
      }).success(function(response){
        if(response.error){
          return false;
        }
      }).error(function(response){
        return false;
      });
    },

    query: function(getItHere, withThisQuery, withThisOrder, withThisLimit){
      return $http({
        method:'get',
        url:'https://api.parse.com/1/classes/'+getItHere,
        params:{
          'where':withThisQuery,
          'order':(withThisOrder||'-updatedAt'),
          'limit':(withThisLimit||0)
        },
        headers:{
          'X-Parse-Application-Id': PARSE_CREDENTIALS.APP_ID,
          'X-Parse-REST-API-Key':PARSE_CREDENTIALS.REST_API_KEY
        }
      }).success(function(response){
        if(response.error){
          return false;
        }
      }).error(function(response){
        return false;
      });
    },

    update: function(updateThis, withThisName, updateItHere, withThisId){
      return $http({
        method:'put',
        url:'https://api.parse.com/1/classes/'+updateItHere+'/'+withThisId,
        headers:{
          'X-Parse-Application-Id': PARSE_CREDENTIALS.APP_ID,
          'X-Parse-REST-API-Key':PARSE_CREDENTIALS.REST_API_KEY,
          'Content-Type':'application/json'
        },
        data:{withThisName:updateThis}
      }).success(function(response){
        if(response.error){
          return false;
        }
      }).error(function(response){
        return false;
      });
    },
    updateArray: function(updateItHere, withThisId, useThisOperation){
      return $http({
        method:'put',
        url:'https://api.parse.com/1/classes/'+updateItHere+'/'+withThisId,
        headers:{
          'X-Parse-Application-Id': PARSE_CREDENTIALS.APP_ID,
          'X-Parse-REST-API-Key':PARSE_CREDENTIALS.REST_API_KEY,
          'Content-Type':'application/json'
        },
        data:useThisOperation
      }).success(function(response){
        if(response.error){
          return false;
        }
      }).error(function(response){
        return false;
      });
    }
  }
})

.factory('RaceService', function($http, PARSE_CREDENTIALS){
  return {
    queryByOrganization: function(organization){
      var currentTime = new Date();
      currentTime.setHours(currentTime.getHours()-1);
      currentTime = $filter('date')(currentTime, "yyyy-MM-ddTHH:mm:ss.sss");
      currentTime = currentTime.toString() + 'Z';

      return $http.get('https://api.parse.com/1/classes/Races',{
        params:{
          where:'{"endDate":{"$gte":{"__type":"Date","iso":"'+currentTime+'"}},"organizationCode":"'+organization+'"}'
        },
        headers: {
          'X-Parse-Application-Id': PARSE_CREDENTIALS.APP_ID,
          'X-Parse-REST-API-Key':PARSE_CREDENTIALS.REST_API_KEY
        }
      });
    },
    createRace: function(race){
      return $http.post('https://api.parse.com/1/classes/Races',race,{
        headers:{
          'X-Parse-Application-Id': PARSE_CREDENTIALS.APP_ID,
          'X-Parse-REST-API-Key':PARSE_CREDENTIALS.REST_API_KEY,
          'Content-Type':'application/json'
        }
      });
    }
  }
})
//.factory('Auth',function() { return { isLoggedIn : false}; })
.factory('AuthenticationService',function($http, $cookies, $location, PARSE_CREDENTIALS) {
  return {
    login: function(credentials) {

      console.log(credentials);

      return $http.get('https://api.parse.com/1/login',{
        params:{
          username:credentials.email,
          password:credentials.password
        },
        headers:{
          'X-Parse-Application-Id': PARSE_CREDENTIALS.APP_ID,
          'X-Parse-REST-API-Key':PARSE_CREDENTIALS.REST_API_KEY
        }
      }).success(function (data, status, headers, config) {
        //$http.defaults.headers.common.Authorization = data.sessionToken;
        console.log(data);
        console.log(status);
        console.log(headers());
        console.log(config);

        $cookies['currentSession'] = data.sessionToken;//save session

        /*authService.loginConfirmed(data, function(config) {  // Step 2 & 3
          config.headers.Authorization = data.sessionToken;
          return config;
        });*/
      });
    },
    logout: function() {
      var sessionToken = $cookies['currentSession'];
      console.log(sessionToken);

      $cookies['currentSession'] = undefined;
      delete $cookies['currentSession'];
      $location.path('/login');
      
      return $http.post('https://api.parse.com/1/logout','',{
        headers: {
          'X-Parse-Application-Id': PARSE_CREDENTIALS.APP_ID,
          'X-Parse-REST-API-Key':PARSE_CREDENTIALS.REST_API_KEY,
          "X-Parse-Session-Token": sessionToken
        }
      });
    },
    signup: function(profile) {
      console.log(profile);
      profile.email = profile.username;
      return $http.post('https://api.parse.com/1/users',profile,{
        headers:{
          'X-Parse-Application-Id': PARSE_CREDENTIALS.APP_ID,
          'X-Parse-REST-API-Key':PARSE_CREDENTIALS.REST_API_KEY,
          'Content-Type':'application/json'
        }
      });
    },
    isLoggedIn: function() {
      //console.log($http.defaults.headers.common.Authorization)
      //if ($http.defaults.headers.common.Authorization)
      if($cookies['currentSession'])
        return true;
      else
        return false;
    }
  }
})
.factory('User',function($http,PARSE_CREDENTIALS){

}).value('PARSE_CREDENTIALS',{
    APP_ID: 'CjxuaHciI7gfI9dheTCaDDmRJmyW8jnS4XO4zhFj',
    REST_API_KEY:'RO2WVdpkGRQF73ahQSRh95x9DmOzhXxbkOGDdqDt'
});
