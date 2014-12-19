;(function () {
'use strict';

angular.module('authFactory', ['firebase'])
.factory('auth', ['$firebaseAuth', function($firebaseAuth) {
  var ref = new Firebase('https://when1021.firebaseio.com/');
  return $firebaseAuth(ref);
}]);

}());

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
    controllerAs : 'vm'
  });
}])  

.controller('AuthController', ['$location', '$routeParams', '$scope', 'auth', 
                     function(  $location,   $routeParams,   $scope,   auth){

  $scope.method = $location.path().replace('/','');
  if ($scope.method === 'logout'){
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

;(function () {
'use strict';

angular.module('dataFactory', ['authFactory', 'firebase'])

.factory('data', ['$location', '$rootScope', 'auth', '$firebase', function($location, $rootScope, auth, $firebase){

  var url = 'https://when1021.firebaseio.com/';
  var query = function(){
    return '?auth=' + $rootScope.user.token;
  };

  return {
    //getEventsForUser: returns event names and ids
    //for currently logged in user
    getEventsForUser : function(cb){
      // $http.get(url + 'users/' + $rootScope.user.uid + '.json' + query())
      //   .success(function(data){
      //     cb(data);
      //   });
      //   //TODO handle this failure
    },
    //add: adds a new event to the logged in user's 
    //events
    add : function(name, cb){
      // $http.post(url + 'events.json', {name: name, owner: $rootScope.user.uid})
      // .success(function(data){
      //   var event = {},
      //       id = data.name;
      //   event[id] = name;
      //   $http.patch(url + 'users/' + $rootScope.user.uid + '.json' + query(), event)
      //   .success(function(data){
      //     cb(id);
      //   });
      // });
      //   //TODO handle this failure
    },
    get : function(id, cb){
      // $http.get(url + 'events/' + id + '.json')
      // .success(function(data){
      //   cb(data);
      // });
    }
  };
}]);
}());

;(function () {
'use strict';

angular.module('edit', ['ngRoute'])

.config(['$routeProvider', function($routeProvider){
  $routeProvider
  .when('/event/:id/edit', {
    templateUrl : 'views/edit.html',
    controller : 'EditController',
    controllerAs : 'vm'
  });
}])  

.controller('EditController', ['$location', '$scope', function($location, $scope){
}]);
//End Iife
}());

;(function () {
'use strict';

angular.module('home', ['ngRoute'])

.config(['$routeProvider', function($routeProvider){
  $routeProvider
  .when('/', {
    templateUrl : 'views/home.html',
    controller : 'HomeController',
    controllerAs : 'vm'
  });
}])  

.controller('HomeController', ['$location', '$scope', function($location, $scope){
  $scope.panelText = [
    'for us to grab dinner',
    'to go camping'
  ];
}]);

}());

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
    var vm = this;
    vm.loggedIn = auth.authenticate();
    $rootScope.$watch('user', function() {
      vm.loggedIn = auth.authenticate();
    });
  }]);
}());

;(function () {
'use strict';

angular.module('profile', ['ngRoute', 'dataFactory', 'authFactory'])

.config(['$routeProvider', function($routeProvider){
  $routeProvider
  .when('/events', {
    templateUrl : 'views/profile.html',
    controller : 'ProfileController',
    controllerAs : 'vm'
  });
}])  

.controller('ProfileController', ['$location', 'auth', '$scope', 'data', 
                          function($location,   auth,   $scope,   data){
  
  if (!auth.authenticate())
    $location.path('/');
  $scope.events = {};
  data.getEventsForUser(function(data){
    $scope.events = data || {};
  });

  $scope.addEvent = function(){
    data.add($scope.newEvent, function(id){
      $location.path('event/' + id);
      $scope.$apply();
    });
  };

  $scope.removeEvent = function(id) {
    data.remove(id, function(){
      delete $scope.events.id;
    });
  };
}]);

}());

;(function () {
'use strict';

angular.module('show', ['ngRoute', 'dataFactory'])

.config(['$routeProvider', function($routeProvider){
  $routeProvider
  .when('/event/:id', {
    templateUrl : 'views/show.html',
    controller : 'ShowController',
    controllerAs : 'vm'
  });
}])  

.controller('ShowController', ['$location', '$scope', 'data', '$routeParams', 
                      function( $location,   $scope,   data,   $routeParams){
  var id = $routeParams.id;
  data.get(id, function(data) {
    $scope.event = data;
  });
  //Replace after calendars are made
  //TODO make calendars work here
  var mockCal = new Array(35);
  var today = new Date();
  for (var i = 0; i < mockCal.length; i++) {
    today.setDate(today.getDate()+1);
    mockCal[i] = {
      date : today.toDateString().substr(3,7),
      morning : true,
      noon : true,
      night : true
    };
  }
  
  $scope.calendar = mockCal;
}]);

}());
