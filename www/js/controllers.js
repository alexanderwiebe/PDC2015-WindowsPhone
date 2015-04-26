angular.module('solfit.controllers', [])

.controller('DashCtrl', function($scope, persistanceService) {
    $scope.init = function() {
      persistanceService.validate().then(function (d) {
        $scope.currentUser = d.data;
        console.log($scope.currentUser);
      }).then(function () {
        var queryValue = {"userId":$scope.currentUser.objectId};
        persistanceService.query('workout', queryValue)
          .then(function (result) {
          //success
          console.log('success');
          $scope.workouts = result.data.results;
          $scope.score = 1234;
          console.log($scope.workouts);
        }, function (errorMsg) {
          //failure
          console.log('failure');
          console.log(errorMsg);
        });
      });
    };
    $scope.init();
})

.controller('LogCtrl', function($scope, persistanceService) {
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
      persistanceService.validate().then(function(d) {
        $scope.currentUser = d.data;
        console.log($scope.currentUser);
      }).then(function(){
        $scope.workout.duration = $scope.workout.duration.hour + ':' +
          $scope.workout.duration.minute + ':' +
          $scope.workout.duration.second;
        $scope.workout.feelings = parseInt($scope.workout.feelings);
        persistanceService.save($scope.workout,'workout',$scope.currentUser.objectId).then(function(i){
          //success
          console.log('success');
          $scope.workout.objectId = i.objectId;
        },function(errorMsg){
          //failure
          console.log('failure');
        });
      });
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

.controller('LogoutCtrl', function($scope, $cookies, AuthenticationService)
{
  console.log("logging out");
  $cookies['currentSession'] = null;
  AuthenticationService.logout();
  //$state.go('login', {}, {reload: true, inherit: false});
  //this is undefinded
  // $route.reload();
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
