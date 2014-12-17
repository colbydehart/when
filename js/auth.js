angular.module('auth', ['ngRoute'])

.config(['$routeProvider', function($routeprovider){
  $routeprovider
  .when('/register', {
    templateurl : 'views/auth.html',
    controller : 'AuthController',
    controlleras : 'vm',
    resolve : {
      authMethod : function(){ return 'register';}
    }
  })
  .when('/login', {
    templateurl : 'views/auth.html',
    controller : 'AuthController',
    controlleras : 'vm',
    resolve : {
      authMethod : function(){ return 'login';}
    }
  });
}])  

.controller('AuthController', ['$location', '$scope', function($location, $scope){
}]);
