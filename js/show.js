angular.module('show', ['ngRoute'])

.config(['$routeProvider', function($routeprovider){
  $routeprovider
  .when('/event/:id', {
    templateurl : 'views/show.html',
    controller : 'ShowController',
    controlleras : 'vm'
  });
}])  

.controller('ShowController', ['$location', '$scope', function($location, $scope){
}]);
