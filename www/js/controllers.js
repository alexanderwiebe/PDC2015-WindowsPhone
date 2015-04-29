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
          $scope.score = 0;
          for(var workout in $scope.workouts){
            $scope.score = $scope.score + ($scope.workouts[workout].score||0);
          }
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

.controller('LogCtrl', function($scope, $ionicPopup, persistanceService) {
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
          var alertPopup = $ionicPopup.alert({
            title: 'Great Job!!',
            template: 'Workout Logged'
          });
          alertPopup.then(function(res) {
            console.log('workout logged');
          });
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

.controller('StandingsCtrl', function($scope, persistanceService) {
    $scope.init = function(){
      var aWeekAgo = new Date(new Date() - 7 * 24 * 60 * 60 * 1000);
      var queryValue = {'createdAt':{'$gte':aWeekAgo}};
      persistanceService.query('workout', queryValue, '-updatedAt', 7)
        .then(function (result) {

          console.log(result);
          $scope.userTotals = [];
          $scope.displayRow = [];
          for(var workout in result.data.results){
            if(!$scope.userTotals[result.data.results[workout].userId]) {
              $scope.userTotals[result.data.results[workout].userId] = 0;
            }
            $scope.userTotals[result.data.results[workout].userId] += (result.data.results[workout].score||0);


          }
          for(var user in $scope.userTotals){
            (function(user){
              persistanceService.users({'objectId':user}, null, 2).then(function(result){
                $scope.displayRow.push({
                  name:result.data.results[0].name,
                  score:$scope.userTotals[user]
                });
              }).then(function(){
                console.log($scope.displayRow);
              });
            })(user);
          }

        });
    };

    $scope.$on('$ionicView.enter', function(){
      $scope.init();
    });
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
})

.controller('RacesCtrl', function($scope, $state, $ionicModal, RaceService, TeamService, persistanceService) {

  $scope.types = [
    { label: 'Around the World', 
      value: 'AROUNDTHEWORLD', 
      description: 'Have the teams compete in a race around the entire world!' },
    { label: 'Across Canada', 
      value: 'ACROSSCANADA',
      description: 'Using the power of maple syrup, the teams will compete in a race from somewhere in the maritimes to like Tofino I guess.' },
    { label: 'Through the Rockies', 
      value: 'ROCKIES',
      description: 'Saddle up your moose and compete from some northern part of the rockies to Banff!' },
    { label: 'To Cancun!', 
      value: 'CANCUN',
      description: 'Be the first to Cancun from... Vancouver?' },
    { label: 'Through the Sahara', 
      value: 'SAHARA',
      description: 'I hate sand... it is so... coarse.' }
  ];

  $ionicModal.fromTemplateUrl('/templates/modal-jointeam.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
  });
  $scope.openModal = function(race) {
    $scope.race = race;
    TeamService.getTeamsByRace(race.objectId).then(function(d) {
      console.log(d);
      $scope.teams = d.data.results;
      $scope.modal.show();
    });
  };
  $scope.closeModal = function() {
    $scope.modal.hide();
  };
  //Cleanup the modal when we're done with it!
  $scope.$on('$destroy', function() {
    $scope.modal.remove();
  });
  // Execute action on hide modal
  $scope.$on('modal.hidden', function() {
    // Execute action
  });
  // Execute action on remove modal
  $scope.$on('modal.removed', function() {
    // Execute action
  });
  // race class:
  // start date
  // end date
  // distance... 
  //  start location
  //  end location?
  

  $scope.getRacesByOrganization = function() {

  };

  $scope.joinTeam = function(team) {
    var updateOp = {"Members":{"__op":"Add","objects":[$scope.currentUser.objectId]}};
    persistanceService.updateArray('Team', team.objectId, updateOp).then(function(d){
      $scope.init();
      console.log('hey added you to the team');
      $scope.closeModal();
    });
  };

  $scope.init = function() {
    RaceService.getActiveRaces().then(function(d) {
      $scope.races = d.data.results;
    });
    persistanceService.validate().then(function (d) {
      $scope.currentUser = d.data;
    })
  };

  $scope.createRace = function(race) {
    RaceService.createRace(race).then(function() {
      console.log("created race");
      $state.go('tab.races');
    })
  };

  $scope.init();


  $scope.$on('$ionicView.enter', function(){
    $scope.init();
  });
})

.controller('TeamCtrl', function($scope,persistanceService,RaceService) {
  $scope.init = function() {
    $scope.newTeam = {};
    $scope.newTeam.Name = '';
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
    RaceService.getActiveRaces().then(function(d) {
      $scope.races = d.data.results;
    });

  };
  $scope.init();

  $scope.leaveTeam = function(leaveThisTeam){
    var updateOp = {"Members":{"__op":"Remove","objects":[$scope.currentUser.objectId]}};
    persistanceService.updateArray('Team', leaveThisTeam.objectId, updateOp).then(function(d){
      $scope.init();
      console.log('hey added you to the team');
    });
  };
  $scope.createTeam = function(){
    $scope.newTeam.race = {"__type": "Pointer","className": "Races","objectId": ""+$scope.newTeam.race.objectId+""};
    console.log($scope.newTeam);
    $scope.newTeam.Members = [$scope.currentUser.objectId];
    persistanceService.save($scope.newTeam,'Team',$scope.currentUser.objectId).then(function(i){
      //success
      console.log('success');
      $scope.init();
    },function(errorMsg){
      //failure
      console.log(errorMsg);
      console.log('failure');
    });
  };
  $scope.joinTeam = function(joinThisTeam){
    var updateOp = {"Members":{"__op":"Add","objects":[$scope.currentUser.objectId]}};
    persistanceService.updateArray('Team', joinThisTeam.objectId, updateOp).then(function(d){
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
