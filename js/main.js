;(function () {
'use strict';

angular.module('when', 
               ['ngRoute',
               'auth',
               'edit',
               'profile',
               'authFactory',
               'show',
               'home']
  ).config(['$routeProvider', function($routeProvider){
    $routeProvider.otherwise({redirectTo: '/'});
  }])
  .controller('HeaderController', ['auth', '$rootScope', function(auth, $rootScope) {
  }]);
}());
