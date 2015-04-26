// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('solfit', ['ionic', 'solfit.controllers', 'solfit.services', 'ngCookies'])

.run(function($ionicPlatform,$rootScope,$state,$location,AuthenticationService) {
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
  $rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams){
    if (toState.authenticate && !AuthenticationService.isLoggedIn()){
      // User isn’t authenticated
      console.log(AuthenticationService.isLoggedIn());
      $state.transitionTo("login");
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
    url: "/tab",
    abstract: true,
    templateUrl: "templates/tabs.html",
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

// the log-on screen
  .state('login',{
      url : '/login',
      templateUrl : 'templates/login.html',
      controller : 'LoginCtrl',
      authenticate: false
    })

  // the signup screen
  .state('signup',{
      url : '/signup',
      templateUrl : 'templates/signup.html',
      controller : 'LoginCtrl',
      authenticate: false
    })

  .state('logout',{
    url : '/logout',
    controller: 'LogoutCtrl',
    authenticate: true
  })

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/dash');

});
