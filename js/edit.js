;(function () {
'use strict';

angular.module('edit', ['ngRoute', 'dataFactory', 'calFactory'])

.config(['$routeProvider', function($routeProvider){
  $routeProvider
  .when('/event/:id/edit', {
    templateUrl : 'views/edit.html',
    controller : 'EditController',
    controllerAs : 'vm',
    private : true
  });
}])  

.controller('EditController', ['$routeParams', '$location', '$scope', 'data', 'cal', 
            function($routeParams, $location, $scope, data, cal){
  data.getEvent($routeParams.id).then(function(obj) {
    obj.$bindTo($scope, 'event').then(function() {
      updateCalendar();
      $scope.$watch('event', updateCalendar);
      $scope.daysToFill = new Array('Sun Mon Tue Wed Thu Fri Sat'.split(' ').indexOf(
        $scope.mergedCal.calendar[0].date.substr(0,3)
      ));
      for (var i = 0; i < $scope.daysToFill.length; i++) {
        $scope.daysToFill[i] = i;
      }
    });
  });

  var showing = false;
  $scope.showCalendar = function(name) {
    showing = true;
    $scope.mergedCal.calendar = _.find($scope.event.participants, {'name': name}).cal;
  };

  $scope.revertCalendar = function() {
    showing = false;
    updateCalendar();
  };

  function updateCalendar() {
    if (!showing){
      $scope.mergedCal = cal.merge(_.cloneDeep($scope.event));  
    }
  }
}]);

}());
