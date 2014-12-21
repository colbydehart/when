;(function () {
'use strict';

angular.module('profile', ['ngRoute', 'dataFactory' ])

.config(['$routeProvider', function($routeProvider){
  $routeProvider
  .when('/events', {
    templateUrl : 'views/profile.html',
    controller : 'ProfileController',
    controllerAs : 'profile',
    private : true
  });
}])  

.controller('ProfileController', ['$location', '$scope', 'data', function($location, $scope, data){
  var vm = this;
  this.message = 'hello';
  
  data.getEventsForUser().$bindTo($scope, 'events');

  $scope.addEvent = function(){
    var added = data.add($scope.newEvent, function(id) {
      $location.path('/event/' + id);
    });
  };

  $scope.removeEvent = function(id) {
  };

}]);

}());
