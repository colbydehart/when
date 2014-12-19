;(function () {
'use strict';

angular.module('profile', ['ngRoute', 'dataFactory', 'authFactory'])

.config(['$routeProvider', function($routeProvider){
  $routeProvider
  .when('/events', {
    templateUrl : 'views/profile.html',
    controller : 'ProfileController',
    controllerAs : 'vm',
    resolve : {
      'currentUser' : ['auth', function(auth){
        auth.$requireAuth();
      }]
    }
  });
}])  

.controller('ProfileController', ['$location', 'currentUser', '$scope', 'data', 
                          function($location,   currentUser,   $scope,   data){
  
  if(!currentUser)
    $location.path('/');
  $scope.events = {};

  data.getEventsForUser(function(data){
  });

  $scope.addEvent = function(){
  };

  $scope.removeEvent = function(id) {
  };

}]);

}());
