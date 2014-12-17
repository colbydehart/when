angular.module('edit', ['ngRoute'])

.config(['$routeProvider', function($routeprovider){
  $routeprovider
  .when('/event/:id/edit', {
    templateurl : 'views/edit.html',
    controller : 'EditController',
    controlleras : 'vm'
  });
}])  

.controller('EditController', ['$location', '$scope', function($location, $scope){
}]);
