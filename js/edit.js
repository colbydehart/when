;(function () {
'use strict';

angular.module('edit', ['ngRoute'])

.config(['$routeProvider', function($routeProvider){
  $routeProvider
  .when('/event/:id/edit', {
    templateUrl : 'views/edit.html',
    controller : 'EditController',
    controllerAs : 'vm',
    private : true
  });
}])  

.controller('EditController', ['$location', '$scope', function($location, $scope){
}]);
//End Iife
}());
