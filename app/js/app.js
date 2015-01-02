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

;(function () {
'use strict';

angular.module('calFactory', [])
.factory('cal', ['$rootScope', function($rootScope){
  return {
    newCal : newCal,
    convertDates : convertDates,
    merge : merge
  };

  function merge(event) {
    var result = {
      names : [],
      calendar : _.clone(event.calendar)
    }, 
        len = result.calendar.length;

    angular.forEach(event.participants, function(val, key) {
      result.names.push({name: val.name});
      for (var i = 0; i < len; i++) {
        var curDay = val.cal[i],
            resDay = result.calendar[i];
        _.merge(resDay, curDay, function(a, b) {
          if (_.isString(a)) return a;
          return a && b;
        });
      }

    });

    return result;
    
  }
  function convertDates(cal) {
    return _.values(cal).map(function(item) {
      return new Date(item);
    });
  }
  function newCal(start, end) {
    var cal = [];
    var today = start;
    var i = 0;
    while (+today < +end){
      cal[i] = {
        date : today.toDateString(),
        morning : true,
        noon : true,
        night : true
      };
      today.setDate(today.getDate()+1);
      i++;
    }
    return cal;
  }

}]);
}());

;(function () {
'use strict';

angular.module('dataFactory', ['authFactory', 'firebase'])

.factory('data', ['$rootScope', '$firebase', '$q', function ($rootScope, $firebase, $q){

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
    addCalendar : function(cal, id) {
      return $firebase(new Firebase(url+'events/'+id +'/participants')).$push(cal);
    },
    addEvent : function(event, cb){
      var id, name = event.name;
      $firebase(new Firebase(url+'events')).$push(event)
      .then(function(ref) {
        id = ref.key();
        var event = {};
        event[id] = name;
        return $firebase(new Firebase(url+'users/'+$rootScope.user.uid)).$update(event);
      })
      .then(function(ref) {
        cb(id);
      })
      .catch(function(err) {
        console.log('Could not add event', err);
      });
    },
    getEvent : function(id){
      return $firebase(new Firebase(url+'events/'+id)).$asObject();
    },
    getCalendar : function(id, user) {
      return $firebase(new Firebase(url+'events/'+id+'/participants/'+user)).$asObject();
    },
    removeEvent : function(id) {
      var eventsSync = $firebase(new Firebase(url+'events')),
          userSync = $firebase(new Firebase(url+'users/' + $rootScope.user.uid));

      userSync.$remove(id).then(function(ref) {
        eventsSync.$remove(id);
      }, function(err) {
        console.log("Could not remove event: ", err);
      });
    },
    update : function(id, event) {
      return $firebase(new Firebase(url+'events')).$update(id, event);
    }
  };
}]);
}());

;(function () {
'use strict';

angular.module('edit', ['ngRoute', 'dataFactory', 'calFactory'])

.config(['$routeProvider', function($routeProvider){
  $routeProvider
  .when('/event/:id/edit', {
    templateUrl : 'views/edit.html',
    controller : 'EditController',
    controllerAs : 'vm',
    private : true
  });
}])  

.controller('EditController', ['$routeParams', '$location', '$scope', 'data', 'cal', 
            function($routeParams, $location, $scope, data, cal){
  data.getEvent($routeParams.id).$bindTo($scope, 'event').then(function() {
    updateCalendar();
    $scope.$watch('event', updateCalendar);
    $scope.daysToFill = new Array('Sun Mon Tue Wed Thu Fri Sat'.split(' ').indexOf(
      $scope.mergedCal.calendar[0].date.substr(0,3)
    ));
    for (var i = 0; i < $scope.daysToFill.length; i++) {
      $scope.daysToFill[i] = i;
    }
  });

  function updateCalendar() {
    $scope.mergedCal = cal.merge(_.cloneDeep($scope.event));  
  }
}]);

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
               'new',
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
  .controller('HeaderController', ['$rootScope', function($rootScope) {
    var vm = this;
    vm.user = $rootScope.user;
  }]);
}());

;(function () {
'use strict';

angular.module('new', ['ngRoute', 'calFactory'])

.config(['$routeProvider', function($routeProvider){
  $routeProvider
  .when('/events/new', {
    templateUrl : 'views/new.html',
    controller : 'NewController',
    controllerAs : 'vm',
    private : true
  });
}])  

.controller('NewController', ['$location', '$scope', 'cal', 'data', '$rootScope', 
                      function($location,   $scope,   cal,   data,   $rootScope){
  $scope.event = {};
  var e = $scope.event;

  e.name = $location.search().name;

  $scope.createEvent = function() {
    e.calendar = cal.newCal($scope.start, $scope.end);
    e.owner = $rootScope.user.uid;
    data.addEvent(e, function(id) {
      $location.path('event/' + id);
    });
  };
}]);
}());

;(function () {
'use strict';

angular.module('profile', ['ngRoute', 'dataFactory', 'calFactory' ])

.config(['$routeProvider', function($routeProvider){
  $routeProvider
  .when('/events', {
    templateUrl : 'views/profile.html',
    controller : 'ProfileController',
    controllerAs : 'profile',
    private : true
  });
}])  

.controller('ProfileController', ['$location', '$scope', 'data', 'cal', function($location, $scope, data, cal){
  var vm = this;
  this.message = 'hello';
  
  data.getEventsForUser().$bindTo($scope, 'events');

  $scope.addEvent = function(){
    $location.path('/events/new').search('name', $scope.newEvent); 
  };

  $scope.removeEvent = function(id) {
    data.removeEvent(id);
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
  $scope.noUser = false;
  $scope.event = data.getEvent(id);
  var days = 'Sun Mon Tue Wed Thu Fri Sat'.split(' ');
  $scope.days = _.zip(days, '0 1 2 3 4 5 6'.split(' '));
  if(localStorage[id]){
    data.getCalendar(id, localStorage[id]).$bindTo($scope, 'calendar').then(fillInDays);
  }
  else{
    $scope.noUser = true;
  }

  $scope.createCalendar = function() {
    $scope.noUser = false;
    var newCal = {};
    newCal.name = $scope.userName;
    newCal.cal = _.clone($scope.event.calendar);
    data.addCalendar(newCal, id)
    .then(function(ref) {
      localStorage[id] = ref.key();
      data.getCalendar(id, localStorage[id]).$bindTo($scope, 'calendar').then(fillInDays);
    });
  };

  $scope.toggleWeek = function(time, index){
    var firstDay = days.indexOf($scope.calendar.cal[0].date.substr(0,3)),
        i, weekState;
    if (time !== 'all') {
      weekState = !$scope.calendar.cal[index][time];
      var numberOfDays = index !== 0 ?  7 : 7 - firstDay;
      for (i = 0; i < numberOfDays; i++) {
        if(i+index < $scope.calendar.cal.length)
          $scope.calendar.cal[i+index][time] = weekState;
      }
    }
    else{
      weekState = !$scope.calendar.cal[index].morning;
      i = 0;
      var ender = index === $scope.calendar.cal.length - 1 ? 
        $scope.daysToFill.length :
        7;
      while(i < ender && $scope.calendar.cal[index - i] !== undefined ){
        $scope.calendar.cal[index - i].morning = weekState;
        $scope.calendar.cal[index - i].noon = weekState;
        $scope.calendar.cal[index - i].night = weekState;
        i++;
      }
    }
  };

  $scope.toggleDay = function(dayIndex) {
    var day = days[dayIndex];
    var state = null;
    for (var i = 0; i < $scope.calendar.cal.length; i++){
      if ($scope.calendar.cal[i].date.substr(0,3) === day) {
        if(state === null){
          state = !$scope.calendar.cal[i].morning;
        }
        $scope.calendar.cal[i].morning = state;
        $scope.calendar.cal[i].noon = state;
        $scope.calendar.cal[i].night = state;
      }
    }
  };

  function fillInDays() {
    $scope.daysToFill = new Array(days.indexOf($scope.calendar.cal[0].date.substr(0,3)));
    for (var i = 0; i < $scope.daysToFill.length; i++) {
      $scope.daysToFill[i] = i;
    }
  }

  var $selector, X, Y, state;
  $scope.beginSelection = function(e) {
    $(document).on('mouseup', endSelection);
    $(document).on('mousemove', moveSelection);
    $('<div>').addClass('selector').css({left : e.pageX+'px' ,top : e.pageY+'px', width:'0px'}).appendTo('body');
    $selector = $('.selector');
    X = e.pageX;
    Y = e.pageY;
    if ($(e.target).attr('id')) {
      var clickedTime = $(e.target).attr('id').split('.');
      state = !$scope.calendar.cal[clickedTime[0]][clickedTime[1]];
    }
    else state = null;
    return false;
  };

  function moveSelection(e) {
    var x = e.pageX,
        y = e.pageY;

    if (x > X)
      $selector.css({left: X+'px', width:(x-X)+'px'});
    else
      $selector.css({left: x+'px', width:(X-x)+'px'});
    if (y > Y)
      $selector.css({top: Y+'px', height:(y-Y)+'px'});
    else
      $selector.css({top: y+'px', height:(Y-y)+'px'});
    return false;
  }

  function endSelection(e) {
    $(document).off('mousemove', moveSelection);
    var left = +$selector.css('left').replace('px',''),
        top = +$selector.css('top').replace('px',''),
        right = left + $selector.width(),
        bottom = top + $selector.height(),
        selectedEls = [];
    $('.noon, .morning, .night').each(function(i, el) {
      var curLeft = $(this).offset().left, curTop = $(this).offset().top,
          curRight = curLeft + $(this).width(), curBottom = curTop + $(this).height();
      if (!(curTop > bottom || curBottom < top || curLeft > right || curRight < left)){
        var cell = $(this).attr('id').split('.'),
            index = +cell[0], time = cell[1];
        if (state === null) state = !$scope.calendar.cal[index][time];
        $scope.calendar.cal[index][time] = state;
      }
    });

    $scope.$apply();
    $selector.remove();
    X = Y = state =  null;
    $(document).off('mouseup', endSelection);
    return false;
  }
  
}]);

}());
