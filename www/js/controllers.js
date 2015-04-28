angular.module('solfit.controllers', [])

.controller('DashCtrl', function($scope, persistanceService) {
    $scope.init = function() {
      persistanceService.validate().then(function (d) {
        $scope.currentUser = d.data;
        console.log($scope.currentUser);
      }).then(function () {
        var queryValue = {"userId":$scope.currentUser.objectId};
        persistanceService.query('workout', queryValue, '-updatedAt', 7)
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

    $scope.$on('$ionicView.enter', function(){
      $scope.init();
    });
})

.controller('LogCtrl', function($scope, persistanceService) {
    $scope.init = function(){
      $scope.workout = {
        event:'',
        duration:{
          hour:0,
          minute:0,
          second:0
        },
        distance:0,
        weights:0,
        sets:0,
        reps:0,
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
        $scope.workout.score = 0;
        /*
        * yeah this will change
        * used 75 calories per km
        * average 7 calories
        * */
        if($scope.workout.distance){
          $scope.workout.score = 75 * $scope.workout.distance;
        }else{
          $scope.workout.score = 7 * $scope.workout.sets * $scope.workout.reps;
        }
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
    $scope.$on('$ionicView.enter', function(){
      $scope.init();
    });
})

.controller('StandingsCtrl', function($scope) {
    $scope.hello = 'world';
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
})

.controller('RacesCtrl', function($scope, RaceService) {

  // race class:
  // start date
  // end date
  // distance... 
  //  start location
  //  end location?

  $scope.getRacesByOrganization = function() {

  };

  $scope.createRace = function() {

  };

  $scope.joinRace = function() {

  };
})

.controller('TeamCtrl', function($scope,persistanceService) {
  $scope.init = function() {
    persistanceService.validate().then(function (d) {
      $scope.currentUser = d.data;
      console.log($scope.currentUser);
    }).then(function () {
     var myTeamQuery = {'Members':$scope.currentUser.objectId};
      persistanceService.query('Team', myTeamQuery, null, 1000).then(function (d) {
        $scope.myTeams = d.data.results;
        console.log('My Teams');
        console.log($scope.myTeams);
      });
      var allTeamQuery = {};
      persistanceService.query('Team', allTeamQuery, null, 1000).then(function (d) {
        $scope.allTeams = d.data.results;
        console.log('All Teams');
        console.log($scope.allTeams);
      });
    });
  };
  $scope.init();

  $scope.joinTeam = function(joinThisTeam){
    var updateOp = {"Members":{"__op":"Add","objects":[$scope.currentUser.objectId]}};
    persistanceService.updateArray($scope.currentUser.objectId, 'Members', 'Team', joinThisTeam.objectId, updateOp).then(function(d){
      $scope.init();
      console.log('hey added you to the team');
    });
  };
  $scope.$on('$ionicView.enter', function(){
    $scope.init();
  });
})

.controller('LogoutCtrl', function($scope, $cookies, $location, AuthenticationService)
{
  console.log("logging out");
  var logoutPromise = AuthenticationService.logout();
  logoutPromise.then(
    function(data) {
      console.log('logout successful');
    }
  );
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
