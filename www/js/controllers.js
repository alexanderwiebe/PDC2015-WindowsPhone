angular.module('solfit.controllers', [])

.controller('DashCtrl', function($scope) {})

.controller('ChatsCtrl', function($scope, Chats) {
  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  }
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
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
