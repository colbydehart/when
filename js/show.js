;(function () {
'use strict';

angular.module('show', ['ngRoute', 'dataFactory'])

.config(['$routeProvider', function($routeProvider){
  $routeProvider
  .when('/event/:id', {
    templateUrl : 'views/show.html',
    controller : 'ShowController',
    controllerAs : 'vm'
  });
}])  

.controller('ShowController', ['$location', '$scope', 'data', '$routeParams', 
                      function( $location,   $scope,   data,   $routeParams){
  var id = $routeParams.id;
  data.get(id).$bindTo($scope, 'event');

  //Replace after calendars are made
  //TODO make calendars work here
  var mockCal = new Array(35);
  var today = new Date();
  for (var i = 0; i < mockCal.length; i++) {
    today.setDate(today.getDate()+1);
    mockCal[i] = {
      date : today.toDateString().substr(3,7),
      morning : true,
      noon : true,
      night : true
    };
  }
  
  $scope.calendar = mockCal;
}]);

}());
