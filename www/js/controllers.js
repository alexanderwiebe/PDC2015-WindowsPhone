angular.module('solfit.controllers', [])

.controller('DashCtrl', function($scope) {})

.controller('LogCtrl', function($scope) {
    $scope.hello = 'sup';
})

.controller('StandingsCtrl', function($scope) {
    $scope.hello = 'world';
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
})

.controller('LoginCtrl',['$scope', 'AuthenticationService', function($scope, AuthenticationService) 
{ 
  $scope.auth = AuthenticationService;

  $scope.login = function(credentials) {
  	console.log("logging in");
  	AuthenticationService.login(credentials);
  }

}])
