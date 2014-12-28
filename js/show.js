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
  $scope.noUser = false;
  $scope.event = data.getEvent(id);
  var days = 'Sun Mon Tue Wed Thu Fri Sat'.split(' ');
  $scope.days = _.zip(days, '0 1 2 3 4 5 6'.split(' '));
  if(localStorage[id]){
    data.getCalendar(id, localStorage[id]).$bindTo($scope, 'calendar').then(function() {
      $scope.daysToFill = new Array(days.indexOf($scope.calendar.cal[0].date.substr(0,3)));
      for (var i = 0; i < $scope.daysToFill.length; i++) {
        $scope.daysToFill[i] = i;
      }
    });
  }
  else{
    $scope.noUser = true;
  }

  $scope.createCalendar = function() {
    $scope.noUser = false;
    var newCal = {};
    newCal.name = $scope.userName;
    newCal.cal = _.clone($scope.event.calendar);
    data.addCalendar(newCal, id)
    .then(function(ref) {
      localStorage[id] = ref.key();
      data.getCalendar(id, localStorage[id]).$bindTo($scope, 'calendar');
    });
  };

  $scope.toggleWeek = function(time, index){
    var firstDay = days.indexOf($scope.calendar.cal[0].date.substr(0,3));
    var state = !$scope.calendar.cal[index][time];
    var numberOfDays = index !== 0 ?
                       7 :
                       7 - firstDay;
      
     for (var i = 0; i < numberOfDays; i++) {
      if(i+index < $scope.calendar.cal.length)
        $scope.calendar.cal[i+index][time] = state;
     }
  };

  $scope.toggleDay = function(dayIndex) {
    var day = days[dayIndex];
    var state = null;
    for (var i = 0; i < $scope.calendar.cal.length; i++){
      if ($scope.calendar.cal[i].date.substr(0,3) === day) {
        if(state === null){
          state = !$scope.calendar.cal[i].morning;
        }
        $scope.calendar.cal[i].morning = state;
        $scope.calendar.cal[i].noon = state;
        $scope.calendar.cal[i].night = state;
      }
    }
  };
  
}]);

}());
