;(function () {
'use strict';

angular.module('profile', ['ngRoute', 'dataFactory', 'authFactory'])

.config(['$routeProvider', function($routeProvider){
  $routeProvider
  .when('/events', {
    templateUrl : 'views/profile.html',
    controller : 'ProfileController',
    controllerAs : 'vm'
  });
}])  

.controller('ProfileController', ['$location', 'auth', '$scope', 'data', 
                          function($location,   auth,   $scope,   data){
  
  if (!auth.authenticate())
    $location.path('/');
  $scope.events = {};
  data.getEventsForUser(function(data){
    $scope.events = data || {};
  });

  $scope.addEvent = function(){
    data.add($scope.newEvent, function(id){
      $location.path('event/' + id);
      $scope.$apply();
    });
  };

  $scope.removeEvent = function(id) {
    data.remove(id, function(){
      delete $scope.events.id;
    });
  };
}]);

}());
