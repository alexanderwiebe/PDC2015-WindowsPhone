/* jshint -W097 */
'use strict';

/* jshint -W117 */
angular.module('solfit.controllers', [])

.controller('DashCtrl', function($scope, $rootScope, $ionicModal, AuthenticationService, DashboardService, WorkoutService, RaceService, TeamService) {

  $scope.labels = ['2006', '2007', '2008', '2009', '2010', '2011', '2012'];
  $scope.series = ['Series A', 'Series B'];

  $scope.data = [
    [65, 59, 80, 81, 56, 55, 40],
    [28, 48, 40, 19, 86, 27, 90]
  ];

  $scope.init = function() {
    AuthenticationService.validate().then(function(d) {
      $scope.currentUser = d.data;
      $rootScope.currentUser = d.data;
      console.log($rootScope.currentUser);
    }).then(function() {

      DashboardService.activeRacesByUser($scope.currentUser.objectId).then(function(result) {
        console.log(result);
        if (result.data.results.length > 0)
        {
          $scope.isInActiveRace = true;
          $scope.activeTeam = result.data.results[0];
          console.log($scope.activeTeam);
        }
        else
        {
          $scope.isInActiveRace = false;
          $scope.activeTeam = null;
        }
      });

      RaceService.getRacesByOrganization($scope.currentUser.code).then(function(result) {
        if (result.data.results.length > 0)
        {
          $scope.organizationHasActiveRace = true;
          $scope.activeRace = result.data.results[0];
          $scope.activeRaceHasStarted = new Date($scope.activeRace.startDateString) < new Date();
          console.log($scope.activeRaceHasStarted);
          console.log("active race: ");
          console.log($scope.activeRace);
        }
        else
        {
          $scope.organizationHasActiveRace = false;
          $scope.activeRace = null;
        }
      });

      WorkoutService.recentWorkoutsByUser($scope.currentUser.objectId)
      //var queryValue = {'userId': $scope.currentUser.objectId};
      //persistanceService.query('workout', queryValue, '-updatedAt', 7)
        .then(function(result) {
          //success
          //console.log('success');
          $scope.workouts = result.data.results;
          $scope.score = 0;
          $scope.recent = [];
          for (var workout in $scope.workouts) {
            var theWorkout = $scope.workouts[workout];
            //console.log(theWorkout);
            if (theWorkout.workoutType === 'steps') {
              //console.log('in steps');
              $scope.recent.push({
                'statement': theWorkout.event + ': ' + theWorkout.steps + ' steps for a score of ' + theWorkout.score + '!',
                'updatedAt': theWorkout.updatedAt
              });
            }else if (theWorkout.workoutType === 'run') {
              $scope.recent.push({
                'statement': theWorkout.event + ': a ' + theWorkout.duration + ' run for a score of ' + theWorkout.score + '!',
                'updatedAt': theWorkout.updatedAt
              });
            }else if (theWorkout.workoutType === 'sport') {
              $scope.recent.push({
                'statement': theWorkout.event + ' for ' + theWorkout.duration + ' for a score of ' + theWorkout.score + '!',
                'updatedAt': theWorkout.updatedAt
              });
            }else if (theWorkout.workoutType === 'workout') {
              $scope.recent.push({
                'statement': theWorkout.event + ': you lifted ' + theWorkout.weights +
                  ' for ' + theWorkout.reps + ' reps and ' + theWorkout.sets + ' sets... score: ' + theWorkout.score + '!',
                'updatedAt': theWorkout.updatedAt
              });
            }
            $scope.score = $scope.score + ($scope.workouts[workout].score || 0);
            //console.log($scope.recent);
          }
          //console.log($scope.workouts);
        }, function(errorMsg) {
          //failure
          //console.log('failure');
          //console.log(errorMsg);
        });
    });
  };
  //$scope.init();
  $ionicModal.fromTemplateUrl('/templates/modal-jointeam.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
  });
  $scope.openModal = function(race) {
    $scope.race = race;
    TeamService.getTeamsByRace(race.objectId).then(function(d) {
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

  $scope.joinTeam = function(team) {
    TeamService.joinTeam(team, $scope.currentUser.objectId);
    /*var updateOp = {'Members': {'__op': 'Add', 'objects': [$scope.currentUser.objectId]}};
    persistanceService.updateArray('Team', team.objectId, updateOp).then(function(d) {
      $scope.init();
      console.log('hey added you to the team');
      $scope.closeModal();
    });*/
  };

  $scope.$on('$ionicView.enter', function() {
    $scope.init();
  });
})

.controller('LogCtrl', function($scope, $ionicPopup, $state, persistanceService) {
  $scope.init = function() {
    $scope.workout = {
      event: '',
      duration: {
        hour: 0,
        minute: 0,
        second: 0
      },
      distance: 0,
      weights: 0,
      sets: 0,
      steps: 0,
      reps: 0,
      feelings: 50,
      notes: ''
    };
    if ($state.current.name === 'tab.LogSteps') {
      $scope.workout.workoutType = 'steps';
    } else if ($state.current.name === 'tab.LogRun') {
      $scope.workout.workoutType = 'run';
    } else if ($state.current.name === 'tab.LogWorkout') {
      $scope.workout.workoutType = 'workout';
    } else if ($state.current.name === 'tab.LogSport') {
      $scope.workout.workoutType = 'sport';
    }
  };
  $scope.init();

  $scope.pdcSaveWorkout = function() {
    persistanceService.validate().then(function(d) {
      $scope.currentUser = d.data;
      console.log($scope.currentUser);
    }).then(function() {
      $scope.workout.duration = $scope.workout.duration.hour + ':' +
        $scope.workout.duration.minute + ':' +
        $scope.workout.duration.second;
      $scope.workout.feelings = parseInt($scope.workout.feelings);
      $scope.workout.score = 0;
      /*var myTeamQuery = {'Members':$scope.currentUser.objectId};
       persistanceService.query('Team', myTeamQuery, null, 1000).then(function (d) {
       $scope.myTeams = d.data.results;
       persistanceService.update('Team', 'score', $scope.workout.score, $scope.myTeams[0].objectId)
       });*/
      /*
       * yeah this will change
       * used 75 calories per km
       * average 7 calories
       * */
      if ($scope.workout.distance) {
        $scope.workout.score = 75 * $scope.workout.distance;
      } else if ($scope.workout.sets) {
        $scope.workout.score = 7 * $scope.workout.sets * $scope.workout.reps;
      } else { // quick google search told me 1 calorie burned for every 20 steps
        $scope.workout.score = $scope.workout.steps / 20;
      }
      persistanceService.save($scope.workout, 'workout', $scope.currentUser.objectId).then(function(i) {
        //success
        console.log('success');
        var alertPopup = $ionicPopup.alert({
          title: 'Great Job!!',
          template: 'Workout Logged'
        });
        alertPopup.then(function(res) {
          console.log('workout logged');
          $state.go('tab.log');
        });
        $scope.workout.objectId = i.objectId;
      }, function(errorMsg) {
        //failure
        console.log('failure');
      });
    });
  };
  $scope.$on('$ionicView.enter', function() {
    $scope.init();
  });
})

.controller('StandingsCtrl', function($scope, persistanceService) {
  $scope.init = function() {
    var aWeekAgo = new Date(new Date() - 7 * 24 * 60 * 60 * 1000);
    var queryValue = {'createdAt': {'$gte': aWeekAgo}};
    persistanceService.query('workout', queryValue, '-updatedAt', 7)
      .then(function(result) {
        //console.log(result);
        $scope.userTotals = [];
        $scope.displayRow = [];
        for (var workout in result.data.results) {
          if (!$scope.userTotals[result.data.results[workout].userId]) {
            $scope.userTotals[result.data.results[workout].userId] = 0;
          }
          $scope.userTotals[result.data.results[workout].userId] += (result.data.results[workout].score || 0);
        }
        for (var user in $scope.userTotals) {
          /* jshint -W083 */
          (function(user) {
            persistanceService.users({'objectId': user}, null, 2).then(function(result) {
              $scope.displayRow.push({
                name: result.data.results[0].name,
                score: $scope.userTotals[user]
              });
            }).then(function() {
              //console.log($scope.displayRow);
            });
          })(user);
        }

      });
    /***Map stuff yo***/
    var geocoder = new google.maps.Geocoder();
    var myLatlng = new google.maps.LatLng(50.4547222, -104.6066667);
    var mapOptions = {
      zoom: 3,
      center: myLatlng
    };
    var map = new google.maps.Map(document.getElementById('canadaRace'), mapOptions);
    var people = [];
    people.push({id: 1, name: 'start', hometown: 'St. Johns', latLng: [51.3725, -55.5947]});
    people.push({id: 2, name: 'end', hometown: 'Vancouver', latLng: [49.2827, -123.1207]});
    people.push({id: 3, name: 'AJ', hometown: '', latLng: [49.6827, -105.4]});
    people.push({id: 4, name: 'Thomas', hometown: '', latLng: [50, -88.8]});
    people.push({id: 5, name: 'Patrick', hometown: '', latLng: [51.0, -72.34]});

    var infowindows = [];

    var raceCoordinates = [
      new google.maps.LatLng(51.3725, -55.5947),
      new google.maps.LatLng(49.2827, -123.1207)
    ];
    var raceLine = new google.maps.Polyline({
      path: raceCoordinates,
      geodesic: false,
      strokeColor: '#0000FF',
      strokeOpacity: 0.5,
      strokeWeight: 2
    });

    raceLine.setMap(map);

    for (var person in people) {//start iterating through peoples bios
      var infowindow = new google.maps.InfoWindow({
        content: '<div class="content">' +
        '<p>' + people[person].name + '</p>' +
        '<img src="http://upload.wikimedia.org/wikipedia/commons/9/93/Cat_poster_2.jpg" width="50" height="50">' +
        '</div>'
      });
      infowindows[people[person].id] = infowindow;
    }//done iterating through peoples bios
    var markers = [];
    for (person in people) {//start iterating through people's location
      var personLoc = new google.maps.LatLng(people[person].latLng[0], people[person].latLng[1]);
      var marker = new google.maps.Marker({
        position: personLoc,
        map: map,
        title: people[person].name,
        personID: people[person].id
      });
      /* jshint -W083 */
      (function(marker) {
        google.maps.event.addListener(marker, 'click', function() {
          infowindows[this.personID].open(map, marker);
        });
      })(marker);
      markers.push(marker);
    }//stop iterating through people's location
    /***Map stuff yo***/

  };

  $scope.$on('$ionicView.enter', function() {
    $scope.init();
  });
})

.controller('AccountCtrl', function($scope, $cookies, $ionicPopup,$timeout, AuthenticationService, ProfileService, PictureService) {
  $scope.init = function() {
    $scope.user = {
      profile: {}
    };
    $scope.user.profile = {
      name: '',
      age: 0,
      height: 0,
      weight: 0,
      email: '',
      gender: 'Female',
      unit: 'Metric',
      picture: {
        name : '',
        __type: 'File'
      }
    };
    AuthenticationService.validate().then(function(d) {
      $scope.user = d.data;
      $scope.user.profile = {};
      $scope.user.profile.name = $scope.user.name;
      $scope.user.profile.age = $scope.user.age;
      $scope.user.profile.height = $scope.user.height;
      $scope.user.profile.weight = $scope.user.weight;
      $scope.user.profile.gender = $scope.user.gender;
      $scope.user.profile.unit = $scope.user.unit;
      $scope.user.profile.picture = $scope.user.picture;
      $scope.user.profile.email = $scope.user.email;
      console.log($scope.user);
    });
  };
  /*
   $scope.$watch($scope.user.name, function(newVal, oldVal){
   console.log(newVal);
   }, true);*/
  $scope.triggerUpload=function()
  {
   var fileuploader = angular.element("#profileInput");
      fileuploader.on('click',function(){
      });
      fileuploader.trigger('click')
  }
  $scope.uploadFile = function(files) {
    PictureService.uploadPicture(files[0]).then(function(data) {
      $scope.user.picture = data.data;
      $scope.user.profile.picture = {
        name : data.data.name,
        __type: "File"
      };
    });
  };

  $scope.updateProfile = function() {
    console.log($scope.user);
    ProfileService.updateProfile($scope.user).then(function() {
      var alertPopup = $ionicPopup.alert({
        title: 'Awesome work!!',
        template: 'Profile Updated'
      });
      alertPopup.then(function(res) {
        console.log('profile updated');
      });
    });
  };

  $scope.logout = function() {
    console.log('logging out');
    var logoutPromise = AuthenticationService.logout();
    logoutPromise.then(
      function(data) {
        /*
        $cookies.currentSession = undefined;
        delete $cookies.currentSession;
        $location.path('/login');*/
        console.log('logout successful');
      }
    );
  }

  $scope.$on('$ionicView.enter', function() {
    $scope.init();
  });
})

.controller('RacesCtrl', function($scope, $state, $ionicModal, RaceService, TeamService, persistanceService) {

  $scope.types = [
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
    var updateOp = {'Members': {'__op': 'Add', 'objects': [$scope.currentUser.objectId]}};
    persistanceService.updateArray('Team', team.objectId, updateOp).then(function(d) {
      $scope.init();
      console.log('hey added you to the team');
      $scope.closeModal();
    });
  };

  $scope.init = function() {
    RaceService.getActiveRaces().then(function(d) {
      $scope.races = d.data.results;
    });
    persistanceService.validate().then(function(d) {
      $scope.currentUser = d.data;
    });
  };

  $scope.createRace = function(race) {
    race.organizationCode = $scope.currentUser.code;
    RaceService.createRace(race).then(function() {
      console.log(race);
      race.endDate = new Date(race.endDate.iso);
      race.startDate = new Date(race.startDate.iso);
      console.log('created race');
      $state.go('tab.races');
    });
  };

  $scope.init();

  $scope.$on('$ionicView.enter', function() {
    $scope.init();
  });
})

.controller('AdminCtrl', function($scope, AuthenticationService, RaceService) {
  $scope.init = function() {
    // ensure the user is still valid and get their account details
    AuthenticationService.validate()
    .then(function(d) {
      $scope.currentUser = d.data;
    })
    .then(function() {
      if (!$scope.currentUser.isAdmin)
      {
        console.log("Error: user is not admin");
      }
      
      RaceService.getRacesByOrganization($scope.currentUser.code).then(function(d) {
        $scope.races = d.data.results;
      });
      $scope.raceTypes = RaceService.getRaceTypes();
      if ($scope.currentUser.isAdmin)
      {
        $scope.canDelete = true;
      }
      else
      {
        $scope.canDelete = false;
      }
      console.log($scope.raceTypes);
    });
  };

  $scope.deleteRace = function(race) {
    RaceService.deleteRace(race).then(function() {
      var index = $scope.races.indexOf(race);
      $scope.races.splice(index, 1);
    });
  };

  $scope.init();
})

.controller('TeamCtrl', function($scope, persistanceService, RaceService) {
  $scope.init = function() {
    $scope.newTeam = {};
    $scope.newTeam.Name = '';
    persistanceService.validate().then(function(d) {
      $scope.currentUser = d.data;
      console.log($scope.currentUser);
    }).then(function() {
      var myTeamQuery = {'Members': $scope.currentUser.objectId};
      persistanceService.query('Team', myTeamQuery, null, 1000).then(function(d) {
        $scope.myTeams = d.data.results;
        console.log('My Teams');
        console.log($scope.myTeams);
      });
      var allTeamQuery = {};
      persistanceService.query('Team', allTeamQuery, null, 1000).then(function(d) {
        $scope.allTeams = d.data.results;
        console.log('All Teams');
        console.log($scope.allTeams);
      });

      RaceService.getRacesByOrganization($scope.currentUser.code).then(function(races) {
        $scope.races = races.data.results;
        console.log('Races by organization:'); 
        console.log($scope.races);
      });
    });

  };
  //$scope.init();

  $scope.leaveTeam = function(leaveThisTeam) {
    var updateOp = {'Members': {'__op': 'Remove', 'objects': [$scope.currentUser.objectId]}};
    persistanceService.updateArray('Team', leaveThisTeam.objectId, updateOp).then(function(d) {
      $scope.init();
      console.log('hey added you to the team');
    });
  };
  $scope.createTeam = function() {
    $scope.newTeam.race = {
      '__type': 'Pointer',
      'className': 'Races',
      'objectId': '' + $scope.newTeam.race.objectId + ''
    };
    console.log($scope.newTeam);
    $scope.newTeam.members = [$scope.currentUser.objectId];
    persistanceService.save($scope.newTeam, 'Team', $scope.currentUser.objectId).then(function(i) {
      //success
      console.log('success');
      $scope.init();
    }, function(errorMsg) {
      //failure
      console.log(errorMsg);
      console.log('failure');
    });
  };
  $scope.joinTeam = function(joinThisTeam) {
    var updateOp = {'Members': {'__op': 'Add', 'objects': [$scope.currentUser.objectId]}};
    persistanceService.updateArray('Team', joinThisTeam.objectId, updateOp).then(function(d) {
      $scope.init();
      console.log('hey added you to the team');
    });
  };
  $scope.$on('$ionicView.enter', function() {
    $scope.init();
  });
})

.controller('LogoutCtrl', function($scope, $rootScope, $cookies, $location, AuthenticationService) {
  console.log('logging out');
  var logoutPromise = AuthenticationService.logout();
  logoutPromise.then(
    function(data) {
      /*
      $cookies.currentSession = undefined;
      delete $cookies.currentSession;
      $location.path('/login');*/
      console.log('logout successful');
    }
  );
})

.controller('LoginCtrl', function($scope, $rootScope, AuthenticationService, $state) {
  $scope.auth = AuthenticationService;

  $scope.login = function(credentials) {
    console.log('logging in');
    var loginPromise = AuthenticationService.login(credentials);
    loginPromise.then(
      function(d) {
        console.log('login successful');
        //console.log(d);
        $rootScope.currentUser = d.data;
        $state.transitionTo('tab.dash');
      },
      function(error) {
        console.log(error);
        $scope.errorMessage = 'Incorrect username or password';
        $scope.errorState = true;
      }
    );
  };

  $scope.signup = function(profile) {
    console.log('signing up');
    var signupPromise = AuthenticationService.signup(profile);

    signupPromise.then(
      function(data) {
        console.log(data);
      },
      function(error) {
        console.log(error);
      }
    );
  };

});