angular.module('solfit.controllers', [])

.controller('DashCtrl', function($scope) {})

.controller('LogCtrl', function($scope) {
    $scope.init = function(){
      $scope.workout = {
        event:'',
        duration:{
          hour:'',
          minute:'',
          second:''
        },
        distance:'',
        weights:'',
        sets:'',
        reps:'',
        feelings:50,
        notes:''
      };
    };
    $scope.init();

    $scope.pdcSaveWorkout = function(){
      console.log($scope.workout);
    };
})

.controller('StandingsCtrl', function($scope) {
    $scope.hello = 'world';
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
})

.controller('LogoutCtrl', function($scope, AuthenticationService)
{
  console.log("logging out");
  AuthenticationService.logout();
  //$state.go('login', {}, {reload: true, inherit: false});
  $route.reload();
})

.controller('LoginCtrl', function($scope, AuthenticationService, $state) 
{ 
  $scope.auth = AuthenticationService;

  $scope.login = function(credentials) {
    console.log("logging in");
    var loginPromise = AuthenticationService.login(credentials);
    loginPromise.then(
      function(data) {
        console.log('login successful');
        $state.transitionTo('tab.dash');
      },
      function(error) {
        console.log(error);
      }
    );
  }

  $scope.signup = function(profile) {
    console.log("signing up");
    var signupPromise = AuthenticationService.signup(profile);

    signupPromise.then(
      function(data) {
        console.log(data);
      },
      function(error) {
        console.log(error);
      }
    );
  }

})
