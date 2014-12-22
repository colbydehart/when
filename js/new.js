;(function () {
'use strict';

angular.module('new', ['ngRoute', 'CalFactory'])

.config(['$routeProvider', function($routeProvider){
  $routeProvider
  .when('/events/new', {
    templateUrl : 'views/new.html',
    controller : 'NewController',
    controllerAs : 'vm',
    private : true
  });
}])  

.controller('NewController', ['$location', '$scope', 'cal', 'data', '$rootScope', 
                      function($location,   $scope,   cal,   data,   $rootScope){
  $scope.event = {};
  var e = $scope.event;

  e.name = $location.search().name;

  $scope.createEvent = function() {
    e.calendar = cal.newCal($scope.start, $scope.end);
    e.owner = $rootScope.user.uid;
    data.addEvent(e, function(id) {
      $location.path('event/' + id);
    });
  };
}]);
}());
