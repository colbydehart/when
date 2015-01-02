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
  $scope.matching = true;
  //TODO more elegant error flashing
  $scope.error =  $location.search().error;
  //Logout
  if ($scope.method === 'logout'){
    auth.$unauth();
    $location.path('/');
  }

  $scope.submit = function(){
    if ($scope.method === 'login') {
      auth.$authWithPassword($scope.user)
      .then(function(authData){
          $location.path('/events');
      })
      .catch(function(err){
        $location.path('/login').search('error', err);
        $scope.$apply();
      });
    }
    if ($scope.method === 'register'){
      if($scope.passwordRepeat !== $scope.user.password){
        $scope.matching = false;
      } else {
        auth.$createUser($scope.user.email, $scope.user.password)
        .then(function() {
          return auth.$authWithPassword($scope.user); 
        })
        .then(function() {
          $location.path('/events');
        })
        .catch(function(error) {
          $location.path('/register').search('error', error);
        });
      }
    }
  };

}]);
}());
