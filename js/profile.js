;(function () {
'use strict';

angular.module('profile', ['ngRoute', 'dataFactory', 'authFactory'])

.config(['$routeProvider', function($routeProvider){
  $routeProvider
  .when('/events', {
    templateUrl : 'views/profile.html',
    controller : 'ProfileController',
    controllerAs : 'vm',
    private : true
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
