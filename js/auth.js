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
  if ($scope.method === 'logout'){
    auth.$unauth();
    $location.path('/');
  }

  $scope.resetPassword = function(e) {
    e.preventDefault();
    auth.$sendPasswordResetEmail($scope.user.email).then(function() {
      $scope.error = {message: 'Password reset email sent to ' + $scope.user.email};
    })
    .catch(function(error) {
      $scope.error = error;
    });
  };

  $scope.submit = function(){
    if ($scope.method === 'login') {
      auth.$authWithPassword($scope.user)
      .then(function(authData){
          $location.path('/events');
      })
      .catch(function(err){
        $scope.error = err;
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
