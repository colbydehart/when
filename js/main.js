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
  .run(['$rootScope', 'auth', '$location', function($rootScope, auth, $location) {
    $rootScope.$on('$routeChangeStart', function(event, next, prior) {
      $rootScope.user = auth.$getAuth();
      if(next.$$route && next.$$route.private && !$rootScope.user)
        $location.path('/');
    });
  }])
  .controller('HeaderController', ['auth', function(auth) {
    var vm = this;
    vm.auth = auth;
  }]);
}());
