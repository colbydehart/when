;(function () {
'use strict';

angular.module('auth', ['ngRoute', 'authFactory'])

.config(['$routeProvider', function($routeprovider){
  $routeprovider
  .when('/register', {
    templateUrl : 'views/auth.html',
    controller : 'AuthController',
    controllerAs : 'vm'
  })
  .when('/login', {
    templateUrl : 'views/auth.html',
    controller : 'AuthController',
    controllerAs : 'vm'
  })
  .when('/logout', {
    template : '',
    controller : 'AuthController',
    controllerAs : 'vm',
    private: true
  });
}])  

.controller('AuthController', ['$location', '$routeParams', '$scope', 'auth', 
                     function(  $location,   $routeParams,   $scope,   auth){

  $scope.method = $location.path().replace('/','');
  if ($scope.method === 'logout' && !auth.$getAuth()){
    auth.logout();
    $location.path('/');
  }
  $scope.error =  $location.search().error;
  //TODO more elegant error flashing

  $scope.submit = function(){
    if ($scope.method === 'login') {
      auth.login($scope.user, function(err, auth){
        if(!err)
          $location.path('/events');
        else
          $location.path('/login').search('error', err);
        $scope.$apply();
      });
    }
    if ($scope.method === 'register'){
      //TODO handle registration
    }
  };

}]);
}());
