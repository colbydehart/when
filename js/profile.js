angular.module('profile', ['ngRoute'])

.config(['$routeProvider', function($routeprovider){
  $routeprovider
  .when('/events', {
    templateurl : 'views/profile.html',
    controller : 'ProfileController',
    controlleras : 'vm'
  });
}])  

.controller('ProfileController', ['$location', '$scope', function($location, $scope){
}]);
