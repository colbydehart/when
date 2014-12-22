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
  if(localStorage[id]){
    data.getCalendar(id, localStorage[id]).$bindTo($scope, 'calendar');
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
  
}]);

}());
