angular.module('when', 
               ['ngRoute',
               'auth',
               'edit',
               'profile',
               'show',
               'home']
  ).config(['$routeProvider', function($routeProvider){
    $routeProvider.otherwise({redirectTo: '/'});
  }]);
