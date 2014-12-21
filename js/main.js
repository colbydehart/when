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
      console.log(next.$$route);
      if(next.$$route && next.$$route.private && !$rootScope.user)
        $location.path('/');
    });
  }])
  .controller('HeaderController', ['$rootScope', function($rootScope) {
    var vm = this;
    vm.user = $rootScope.user;
  }]);
}());
