/***
 * SOLFIT
 */
/* jshint -W097 */
'use strict';

/* jshint -W117 */
angular.module('solfit', ['ionic', 'solfit.controllers', 'solfit.services', 'ngCookies', 'chart.js'])

.run(function($ionicPlatform, $rootScope, $state, $location,$timeout, AuthenticationService) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
  $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
    if (toState.authenticate && !AuthenticationService.isLoggedIn()) {
      // User isn’t authenticated
      console.log(AuthenticationService.isLoggedIn());
      $state.transitionTo('login');
      event.preventDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the tabs directive
  .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html',
    authenticate: true
  })

  // Each tab has its own nav history stack:

  .state('tab.dash', {
    url: '/dash',
    views: {
      'tab-dash': {
        templateUrl: 'templates/tab-dash.html',
        controller: 'DashCtrl'
      }
    },
    authenticate: true
  })
  .state('tab.races', {
    url: '/races',
    views: {
      'tab-dash': {
        templateUrl: 'templates/events.html',
        controller: 'RacesCtrl'
      }
    },
    authenticate: true
  })
  .state('tab.createrace', {
    url:'/races/createrace',
    views: {
      'tab-dash': {
        templateUrl: 'templates/createrace.html',
        controller: 'RacesCtrl'
      }
    },
    authenticate: true
  })
  .state('tab.log', {
    url: '/log',
    views: {
      'tab-log': {
        templateUrl: 'templates/tab-log.html',
        controller: 'LogCtrl'
      }
    },
    authenticate: true
  })
  //Log -> LogRun
  .state('tab.LogRun', {
    url:'/log/logRun',
    views: {
      'tab-log' : {
        templateUrl: 'templates/logRun.html',
        controller: 'LogCtrl'
      }
    },
    authenticate: true
  })
  //Log -> LogSport
  .state('tab.LogSport', {
    url:'/log/logSport',
    views: {
      'tab-log' : {
        templateUrl: 'templates/logSport.html',
        controller: 'LogCtrl'
      }
    },
    authenticate: true
  })
  //Log -> LogWorkout
  .state('tab.LogWorkout', {
    url:'/log/logWorkout',
    views: {
      'tab-log' : {
        templateUrl: 'templates/logWorkout.html',
        controller: 'LogCtrl'
      }
    },
    authenticate: true
  })
  //Log -> LogSteps
  .state('tab.LogSteps', {
    url:'/log/logSteps',
    views: {
      'tab-log' : {
        templateUrl: 'templates/logSteps.html',
        controller: 'LogCtrl'
      }
    },
    authenticate: true
  })
  .state('tab.standings', {
    url: '/standings',
    views: {
      'tab-standings': {
        templateUrl: 'templates/tab-standings.html',
        controller: 'StandingsCtrl'
      }
    },
    authenticate: true
  })
  .state('tab.account', {
    url: '/account',
    views: {
      'tab-account': {
        templateUrl: 'templates/tab-account.html',
        controller: 'AccountCtrl'
      }
    },
    authenticate: true
  })

  .state('tab.teams', {
    url: '/teams',
    views: {
      'tab-teams': {
        templateUrl: 'templates/tab-teams.html',
        controller: 'TeamCtrl'
      }
    },
    authenticate: true
  })

  .state('tab.admin', {
    url: '/admin',
    views: {
      'tab-admin': {
        templateUrl: 'templates/tab-admin.html',
        controller: 'AdminCtrl'
      }
    },
    authenticate: true
  })

  //Teams -> TeamCreate
  .state('tab.teamCreate', {
    url: '/teams/teamCreate',
    views: {
      'tab-teams': {
        templateUrl: 'templates/teamCreate.html',
        controller: 'TeamCtrl'
      }
    },
    authenticate: true
  })

    //Teams -> TeamJoin
  .state('tab.teamJoin', {
    url: '/teams/teamJoin',
    views: {
      'tab-teams': {
        templateUrl: 'templates/teamJoin.html',
        controller: 'TeamCtrl'
      }
    },
    authenticate: true
  })
  // the log-on screen
  .state('login', {
    url : '/login',
    templateUrl : 'templates/login.html',
    controller : 'LoginCtrl',
    authenticate: false
  })
  // the signup screen
  .state('signup', {
    url : '/signup',
    templateUrl : 'templates/signup.html',
    controller : 'LoginCtrl',
    authenticate: false
  })
  .state('logout', {
    url : '/logout',
    controller: 'LogoutCtrl',
    template: '',
    authenticate: true
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/dash');
});
