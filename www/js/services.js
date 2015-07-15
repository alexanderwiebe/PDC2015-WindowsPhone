/* jshint -W097 */
'use strict';

/* jshint -W117 */
angular.module('solfit.services', [])
  .factory('DashboardService', function($http, $cookies, PARSE_CREDENTIALS, $filter) {
    return {
      activeRacesByUser: function(userId) {
        var currentTime = new Date();
        currentTime.setHours(currentTime.getHours());
        currentTime = $filter('date')(currentTime, 'yyyy-MM-ddTHH:mm:ss.sss');
        currentTime = currentTime.toString() + 'Z';
        console.log(currentTime);
        return $http.get('https://api.parse.com/1/classes/Team', {
          params: {
            where: '{"Members":"' + userId + '",' +
                      '"raceId":{'+
                        '"$select":{' +
                          '"query":{' +
                            '"className":"Races",' +
                            '"where":{' +
                              '"endDate":{"$gte":{"__type":"Date","iso":"' + currentTime +'"}}' +
                            '}' +
                          '},' +
                          '"key":"objectId"' +
                        '}' +
                      '}' +
                    '}'
           ,include: "race"
          },
          headers: {
            'X-Parse-Application-Id': PARSE_CREDENTIALS.APP_ID,
            'X-Parse-REST-API-Key': PARSE_CREDENTIALS.REST_API_KEY
          }
        });
      }
    }
  })

  .factory('WorkoutService', function($http, $cookies, PARSE_CREDENTIALS) {
    return {
      recentWorkoutsByUser: function(userId) {
        return $http.get('https://api.parse.com/1/classes/workout', {
          params: {
            where: '{"userId":"' + userId + '"}',
            order: '-updatedAt',
            limit: 7
          },
          headers: {
            'X-Parse-Application-Id': PARSE_CREDENTIALS.APP_ID,
            'X-Parse-REST-API-Key': PARSE_CREDENTIALS.REST_API_KEY
          }
        });
      }
    }
  })

  .factory('persistanceService', function($http, $cookies, PARSE_CREDENTIALS) {
    return {
      /**
       * uses the 'currentSession' cookie to get current user
       * @returns {current user}
       */
      validate: function() {
        return $http.get('https://api.parse.com/1/users/me', {
          headers: {
            'X-Parse-Application-Id': PARSE_CREDENTIALS.APP_ID,
            'X-Parse-REST-API-Key': PARSE_CREDENTIALS.REST_API_KEY,
            'X-Parse-Session-Token': $cookies.currentSession
          }
        }).success(function(response) {
          if (response.error) {
            return false;
          }
        }).error(function(response) {
          return false;
        });
      },
      users: function(withThisQuery, withThisOrder, withThisLimit) {
        return $http({
          method: 'get',
          url: 'https://api.parse.com/1/users/',
          params: {
            'where': withThisQuery,
            'order': (withThisOrder || '-updatedAt'),
            'limit': (withThisLimit || 1000)
          },
          headers: {
            'X-Parse-Application-Id': PARSE_CREDENTIALS.APP_ID,
            'X-Parse-REST-API-Key': PARSE_CREDENTIALS.REST_API_KEY
          }
        }).success(function(response) {
          if (response.error) {
            return false;
          }
        }).error(function(response) {
          return false;
        });
      },
      updateUser: function(thisUser, thisUserID, withThisSession) {
        return $http({
          method: 'put',
          url: 'https://api.parse.com/1/users/' + thisUserID,
          headers: {
            'X-Parse-Application-Id': PARSE_CREDENTIALS.APP_ID,
            'X-Parse-REST-API-Key': PARSE_CREDENTIALS.REST_API_KEY,
            'X-Parse-Session-Token': withThisSession
          },
          data: thisUser
        });
      },
      save: function(saveThis, saveItHere, withUserObjectID) {
        saveThis.userId = saveThis.userId || withUserObjectID;
        return $http({
          method: 'post',
          url: 'https://api.parse.com/1/classes/' + saveItHere,
          headers: {
            'X-Parse-Application-Id': PARSE_CREDENTIALS.APP_ID,
            'X-Parse-REST-API-Key': PARSE_CREDENTIALS.REST_API_KEY,
            'Content-Type': 'application/json'
          },
          data: saveThis
        }).success(function(response) {
          if (response.error) {
            return false;
          }
        }).error(function(response) {
          return false;
        });
      },

      query: function(getItHere, withThisQuery, withThisOrder, withThisLimit) {
        return $http({
          method: 'get',
          url: 'https://api.parse.com/1/classes/' + getItHere,
          params: {
            'where': withThisQuery,
            'order': (withThisOrder || '-updatedAt'),
            'limit': (withThisLimit || 1000)
          },
          headers: {
            'X-Parse-Application-Id': PARSE_CREDENTIALS.APP_ID,
            'X-Parse-REST-API-Key': PARSE_CREDENTIALS.REST_API_KEY
          }
        }).success(function(response) {
          if (response.error) {
            return false;
          }
        }).error(function(response) {
          return false;
        });
      },

      update: function(updateThis, withThisName, updateItHere, withThisId) {
        return $http({
          method: 'put',
          url: 'https://api.parse.com/1/classes/' +
            updateItHere + '/' + withThisId,
          headers: {
            'X-Parse-Application-Id': PARSE_CREDENTIALS.APP_ID,
            'X-Parse-REST-API-Key': PARSE_CREDENTIALS.REST_API_KEY,
            'Content-Type': 'application/json'
          },
          data: {withThisName: updateThis}
        }).success(function(response) {
          if (response.error) {
            return false;
          }
        }).error(function(response) {
          return false;
        });
      },
      updateArray: function(updateItHere, withThisId, useThisOperation) {
        return $http({
          method: 'put',
          url: 'https://api.parse.com/1/classes/' +
            updateItHere + '/' + withThisId,
          headers: {
            'X-Parse-Application-Id': PARSE_CREDENTIALS.APP_ID,
            'X-Parse-REST-API-Key': PARSE_CREDENTIALS.REST_API_KEY,
            'Content-Type': 'application/json'
          },
          data: useThisOperation
        }).success(function(response) {
          if (response.error) {
            return false;
          }
        }).error(function(response) {
          return false;
        });
      }/*,
       updateTeamScore: function(addThisScore, withThisId){
       return $http({
       method:'put',
       url:'https://api.parse.com/1/classes/Team/'+withThisId,
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
       }*/
    };
  })

  .factory('ProfileService', function($http, PARSE_CREDENTIALS) {
    return {
      updateProfile: function(user) {
        console.log(user);
        return $http.put('https://api.parse.com/1/users/' + user.objectId, user.profile, {
          headers: {
            'X-Parse-Application-Id': PARSE_CREDENTIALS.APP_ID,
            'X-Parse-REST-API-Key': PARSE_CREDENTIALS.REST_API_KEY,
            'X-Parse-Session-Token': user.sessionToken
          }
        }).success(function(response) {
          if (response.error) {
            return false;
          }
        }).error(function(response) {
          return false;
        });
      }
    }
  })

  .factory('TeamService', function($http, PARSE_CREDENTIALS) {
    //where={"race":{"__type":"Pointer","className":"Race","objectId":"8TOXdXf3tz"}}'
    //'where={"post":{"__type":"Pointer","className":"Post","objectId":"8TOXdXf3tz"}}'
    return {
      getTeamsByRace: function(raceObjectId) {
        //console.log(raceObjectId);
        return $http.get('https://api.parse.com/1/classes/Team', {
          params: {
            where: '{"race":{"__type":"Pointer","className":"Races","objectId":"' +
              raceObjectId + '"}}'
          },
          headers: {
            'X-Parse-Application-Id': PARSE_CREDENTIALS.APP_ID,
            'X-Parse-REST-API-Key': PARSE_CREDENTIALS.REST_API_KEY
          }
        });
      },
      joinTeam: function(team, userId) {
        return $http.put('https://api.parse.com/1/classes/Team/' + team.objectId,
          '{"Members":{"__op":"AddUnique","objects":["' + userId + '"]}}', {
          headers: {
            'X-Parse-Application-Id': PARSE_CREDENTIALS.APP_ID,
            'X-Parse-REST-API-Key': PARSE_CREDENTIALS.REST_API_KEY,
            "Content-Type": "application/json"
          }
        }).success(function(response) {
          if (response.error) {
            return false;
          }
        }).error(function(response) {
          return false;
        });
      }
    };
  })

  .factory('PictureService', function($http, PARSE_CREDENTIALS) {
    return {
      uploadPicture: function(file) {
        console.log(file);
        return $http.post('https://api.parse.com/1/files/' + file.name, file, {
          headers: {
            'X-Parse-Application-Id': PARSE_CREDENTIALS.APP_ID,
            'X-Parse-REST-API-Key': PARSE_CREDENTIALS.REST_API_KEY,
            'Content-Type': 'image/png'
          }
        });
      }
    };
  })
  .factory('RaceService', function($http, PARSE_CREDENTIALS, $filter) {
    return {
      getRacesByOrganization: function(organization) {
        var currentTime = new Date();
        currentTime.setHours(currentTime.getHours());
        currentTime = $filter('date')(currentTime, 'yyyy-MM-ddTHH:mm:ss.sss');
        currentTime = currentTime.toString() + 'Z';

        console.log(currentTime);

        return $http.get('https://api.parse.com/1/classes/Races', {
          params: {
            where: '{"endDate":{"$gte":{"__type":"Date","iso":"' + currentTime + '"}},' +
              '"organizationCode":"' + organization + '"}'
          },
          headers: {
            'X-Parse-Application-Id': PARSE_CREDENTIALS.APP_ID,
            'X-Parse-REST-API-Key': PARSE_CREDENTIALS.REST_API_KEY
          }
        });
      },

      createRace: function(race) {
        // don't want any hour or minutes on the date so have to do it this way
        // also, we have endDate/endDateString and startDate/startDateString because
        // the model validation triggers if we just use endDate and startDate
        // after we turn it into json... it doesn't go back to a date angular likes
        race.endDate = $filter('date')(race.endDateString, 'yyyy-MM-ddTHH:mm:ss.sss');
        race.endDate = race.endDate.toString() + 'Z';
        race.startDate = $filter('date')(race.startDateString, 'yyyy-MM-ddTHH:mm:ss.sss');
        race.startDate = race.startDate.toString() + 'Z';

        race.endDate = {"__type": "Date","iso": "" + race.endDate + ""};
        race.startDate = {"__type": "Date","iso": "" + race.startDate + ""};
        return $http.post('https://api.parse.com/1/classes/Races', race, {
          headers: {
            'X-Parse-Application-Id': PARSE_CREDENTIALS.APP_ID,
            'X-Parse-REST-API-Key': PARSE_CREDENTIALS.REST_API_KEY,
            'Content-Type': 'application/json'
          }
        });
      },
      deleteRace: function(race) {
        return $http.delete('https://api.parse.com/1/classes/Races/' + race.objectId, {
          headers: {
            'X-Parse-Application-Id': PARSE_CREDENTIALS.APP_ID,
            'X-Parse-REST-API-Key': PARSE_CREDENTIALS.REST_API_KEY
          }
        });
      },
      getActiveRaces: function() {
        var currentTime = new Date();
        currentTime.setHours(currentTime.getHours() - 1);
        currentTime = $filter('date')(currentTime, 'yyyy-MM-ddTHH:mm:ss.sss');
        currentTime = currentTime.toString() + 'Z';
        //console.log('get active races');
        //        params:{
        //where:'{"endDate":{"$gte":{"__type":"Date","iso":"'+currentTime+'"}}}'
        //  },
        return $http.get('https://api.parse.com/1/classes/Races', {
          headers: {
            'X-Parse-Application-Id': PARSE_CREDENTIALS.APP_ID,
            'X-Parse-REST-API-Key': PARSE_CREDENTIALS.REST_API_KEY
          }
        });
      },
      getRaceTypes: function() {
        let raceTypes =
        [
          {
            label: 'Around the World',
            value: 'AROUNDTHEWORLD',
            description: 'Have the teams compete in a race around the entire world!'
          },
          {
            label: 'Across Canada',
            value: 'ACROSSCANADA',
            description: 'Using the power of maple syrup, the teams will compete in a race from somewhere in the maritimes to like Tofino I guess.'
          },
          {
            label: 'Through the Rockies',
            value: 'ROCKIES',
            description: 'Saddle up your moose and compete from some northern part of the rockies to Banff!'
          },
          {
            label: 'To Cancun!',
            value: 'CANCUN',
            description: 'Be the first to Cancun from... Vancouver?'
          },
          {
            label: 'Through the Sahara',
            value: 'SAHARA',
            description: 'I hate sand... it is so... coarse.'
          }
        ];

        return raceTypes;
      }
    };
  })
//.factory('Auth',function() { return { isLoggedIn : false}; })
  .factory('AuthenticationService', function($http, $cookies, $location, PARSE_CREDENTIALS) {
    /*
    this.validate = function() {
      return $http.get('https://api.parse.com/1/users/me', {
        headers: {
          'X-Parse-Application-Id': PARSE_CREDENTIALS.APP_ID,
          'X-Parse-REST-API-Key': PARSE_CREDENTIALS.REST_API_KEY,
          'X-Parse-Session-Token': $cookies.currentSession
        }
      }).success(function(response) {
        if (response.error) {
          return false;
        }
      }).error(function(response) {
        return false;
      });
    };

    this.login = function(credentials) {
      return $http.get('https://api.parse.com/1/login', {
        params: {
          username: credentials.email,
          password: credentials.password
        },
        headers: {
          'X-Parse-Application-Id': PARSE_CREDENTIALS.APP_ID,
          'X-Parse-REST-API-Key': PARSE_CREDENTIALS.REST_API_KEY
        }
      }).success(function(data, status, headers, config) {
        $cookies.currentSession = data.sessionToken;//save session
      });
    };

    this.logout = function() {
      var sessionToken = $cookies.currentSession;
      console.log("in logout service");

      return $http.post('https://api.parse.com/1/logout', '', {
        headers: {
          'X-Parse-Application-Id': PARSE_CREDENTIALS.APP_ID,
          'X-Parse-REST-API-Key': PARSE_CREDENTIALS.REST_API_KEY,
          'X-Parse-Session-Token': sessionToken
        }
      });
    };
    this.signup = function(profile) {
      //console.log(profile);
      profile.email = profile.username;
      return $http.post('https://api.parse.com/1/users', profile, {
        headers: {
          'X-Parse-Application-Id': PARSE_CREDENTIALS.APP_ID,
          'X-Parse-REST-API-Key': PARSE_CREDENTIALS.REST_API_KEY,
          'Content-Type': 'application/json'
        }
      });
    };
    this.isLoggedIn = function() {
      //console.log($http.defaults.headers.common.Authorization)
      //if ($http.defaults.headers.common.Authorization)
      console.log('in isLoggedIn' + $cookies.currentSession);
      if ($cookies.currentSession) {
        return true;
      } else {
        return false;
      }
    };*/

    return {
      validate: function() {
        return $http.get('https://api.parse.com/1/users/me', {
          headers: {
            'X-Parse-Application-Id': PARSE_CREDENTIALS.APP_ID,
            'X-Parse-REST-API-Key': PARSE_CREDENTIALS.REST_API_KEY,
            'X-Parse-Session-Token': $cookies.currentSession
          }
        }).success(function(response) {
          if (response.error) {
            return false;
          }
        }).error(function(response) {
          return false;
        });
      },
      login: function(credentials) {

        //console.log(credentials);

        return $http.get('https://api.parse.com/1/login', {
          params: {
            username: credentials.email,
            password: credentials.password
          },
          headers: {
            'X-Parse-Application-Id': PARSE_CREDENTIALS.APP_ID,
            'X-Parse-REST-API-Key': PARSE_CREDENTIALS.REST_API_KEY
          }
        }).success(function(data, status, headers, config) {
          //$http.defaults.headers.common.Authorization = data.sessionToken;

          $cookies.currentSession = data.sessionToken;//save session
          //this.currentUser = data;
          //console.log('From sessionService: ' + this.currentUser);
        });
      },
      logout: function() {
        var sessionToken = $cookies.currentSession;
        //console.log(sessionToken);

        $cookies.currentSession = undefined;
        delete $cookies.currentSession;
        $location.path('/login');

        return $http.post('https://api.parse.com/1/logout', '', {
          headers: {
            'X-Parse-Application-Id': PARSE_CREDENTIALS.APP_ID,
            'X-Parse-REST-API-Key': PARSE_CREDENTIALS.REST_API_KEY,
            'X-Parse-Session-Token': sessionToken
          }
        });
      },
      signup: function(profile) {
        //console.log(profile);
        profile.email = profile.username;
        return $http.post('https://api.parse.com/1/users', profile, {
          headers: {
            'X-Parse-Application-Id': PARSE_CREDENTIALS.APP_ID,
            'X-Parse-REST-API-Key': PARSE_CREDENTIALS.REST_API_KEY,
            'Content-Type': 'application/json'
          }
        });
      },
      isLoggedIn: function() {
        //console.log($http.defaults.headers.common.Authorization)
        //if ($http.defaults.headers.common.Authorization)
        if ($cookies.currentSession) {
          return true;
        } else {
          return false;
        }
      },
      validate: function() {
        return $http.get('https://api.parse.com/1/users/me', {
          headers: {
            'X-Parse-Application-Id': PARSE_CREDENTIALS.APP_ID,
            'X-Parse-REST-API-Key': PARSE_CREDENTIALS.REST_API_KEY,
            'X-Parse-Session-Token': $cookies.currentSession
          }
        }).success(function(response) {
          if (response.error) {
            return false;
          }
        }).error(function(response) {
          return false;
        });
      }
    };
  })
  .factory('User', function($http, PARSE_CREDENTIALS) {

  }).value('PARSE_CREDENTIALS', {
    APP_ID: 'CjxuaHciI7gfI9dheTCaDDmRJmyW8jnS4XO4zhFj',
    REST_API_KEY: 'RO2WVdpkGRQF73ahQSRh95x9DmOzhXxbkOGDdqDt'
  });
