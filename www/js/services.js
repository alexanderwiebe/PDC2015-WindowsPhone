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

  // Some fake testing data
  var chats = [{
    id: 0,
    name: 'Ben Sparrow',
    lastText: 'You on your way?',
    face: 'https://pbs.twimg.com/profile_images/514549811765211136/9SgAuHeY.png'
  }, {
    id: 1,
    name: 'Max Lynx',
    lastText: 'Hey, it\'s me',
    face: 'https://avatars3.githubusercontent.com/u/11214?v=3&s=460'
  }, {
    id: 2,
    name: 'Andrew Jostlin',
    lastText: 'Did you get the ice cream?',
    face: 'https://pbs.twimg.com/profile_images/491274378181488640/Tti0fFVJ.jpeg'
  }, {
    id: 3,
    name: 'Adam Bradleyson',
    lastText: 'I should buy a boat',
    face: 'https://pbs.twimg.com/profile_images/479090794058379264/84TKj_qa.jpeg'
  }, {
    id: 4,
    name: 'Perry Governor',
    lastText: 'Look at my mukluks!',
    face: 'https://pbs.twimg.com/profile_images/491995398135767040/ie2Z_V6e.jpeg'
  }];

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
