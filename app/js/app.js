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
      .catch(function(){
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

;(function () {
'use strict';

angular.module('dataFactory', ['authFactory', 'firebase'])

.factory('data', ['$rootScope', '$firebase', function ($rootScope, $firebase){

  var url = 'https://when1021.firebaseio.com/';
  var query = function(){
    return '?auth=' + $rootScope.user.token;
  };

  return {
    //GET_EVENTS_FOR_USER: gets all events for
    //   currently logged in user.
    getEventsForUser : function(cb){
      var sync = $firebase(new Firebase(url + 'users/' + $rootScope.user.uid ));
      return sync.$asObject();
    },
    //ADD: adds a new event to the 
    //     logged in user's events
    add : function(name,cb){
      var eventsSync = $firebase(new Firebase(url+'events')),
          userSync = $firebase(new Firebase(url+'users/'+$rootScope.user.uid)),
          id;
      //Push in the new event into the 
      //     'events' key on fb
      eventsSync.$push({name: name, owner : $rootScope.user.uid})
      .then(function(ref) {
        id = ref.key();
        var event = {};
        event[id] = name;
        //Then add that event's id to the 
        //     current users events on fb
        return userSync.$update(event);
      })
      .then(function(ref) {
        cb(id);
      });
    },
    //GET: gets a single event from a provided id
    get : function(id, cb){
      var sync = $firebase(new Firebase(url+'events/'+id));
      return sync.$asObject();
    },
    remove : '',
    update : ''
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
    controllerAs : 'vm',
    private : true
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

;(function () {
'use strict';

angular.module('profile', ['ngRoute', 'dataFactory' ])

.config(['$routeProvider', function($routeProvider){
  $routeProvider
  .when('/events', {
    templateUrl : 'views/profile.html',
    controller : 'ProfileController',
    controllerAs : 'profile',
    private : true
  });
}])  

.controller('ProfileController', ['$location', '$scope', 'data', function($location, $scope, data){
  var vm = this;
  this.message = 'hello';
  
  data.getEventsForUser().$bindTo($scope, 'events');

  $scope.addEvent = function(){
    var added = data.add($scope.newEvent, function(id) {
      $location.path('/event/' + id);
    });
  };

  $scope.removeEvent = function(id) {
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
  data.get(id).$bindTo($scope, 'event');

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
