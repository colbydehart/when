;(function () {
'use strict';

angular.module('profile', ['ngRoute', 'dataFactory', 'CalFactory' ])

.config(['$routeProvider', function($routeProvider){
  $routeProvider
  .when('/events', {
    templateUrl : 'views/profile.html',
    controller : 'ProfileController',
    controllerAs : 'profile',
    private : true
  });
}])  

.controller('ProfileController', ['$location', '$scope', 'data', 'cal', function($location, $scope, data, cal){
  var vm = this;
  this.message = 'hello';
  
  data.getEventsForUser().$bindTo($scope, 'events');

  $scope.addEvent = function(){
    $location.path('/events/new').search('name', $scope.newEvent); 
  };

  $scope.removeEvent = function(id) {
    data.remove(id);
  };

}]);

}());
