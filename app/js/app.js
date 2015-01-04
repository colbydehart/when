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

;(function () {
'use strict';

angular.module('calFactory', [])
.factory('cal', ['$rootScope', function($rootScope){
  return {
    newCal : newCal,
    convertDates : convertDates,
    merge : merge
  };

  
  function merge(event, skip) {
    if (!event.participants[0]){
      event.participants = _.values(event.participants);
    }
    var parts = event.participants,
        len = parts.length,
        skipTemp = skip,
        maxSkip = (len*(len+1))/2 - 4,
        result = {
          names : [],
          unavailable : [],
          emails : [],
          calendar : _.cloneDeep(event.calendar)
        };

    for (var i = parts.length-1; i >= 0; i--) {
      var curPart = parts[i];
      if(skipTemp >= len){
        result.unavailable.push({name: curPart.name});
        skipTemp -= len;
      }
      else if(skipTemp === i){
        result.unavailable.push({name: curPart.name});
      }
      else if(curPart.unavailable){
        result.unavailable.push({name: curPart.name});
      }
      else{
        result.names.push({name: curPart.name});
        result.emails.push(curPart.email);
        for (var j = 0; j < curPart.cal.length ; j++) {
          _.merge(result.calendar[j], curPart.cal[j], mergeDays);
        }
      }
    }
    result.emails = result.emails.join(',');

    if(availableDates(result.calendar)){
      return result;
    }
    else if (skip === maxSkip){
      result.impossible = true;
      return result;
    }
    else{
      return merge(event, skip>-1?skip+1:0);
    }
  }

  function availableDates(cal) {
    var res = false;
    for (var i = 0; i < cal.length; i++) {
      if(cal[i].morning || cal[i].noon || cal[i].night){
        res = true;
      }
    }
    return res;
  }

  function mergeDays(a, b) {
    if (_.isString(a)) return a;
    return a && b;
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
    getEventsForUser : function(scope, varName){
      var sync = $firebase(new Firebase(url + 'users/' + $rootScope.user.uid ));
      return sync.$asObject().$bindTo(scope, varName);
    },


    addParticipant : function(cal, id) {
      return $q(function(res, rej) {
        $firebase(new Firebase(url+'events/'+id +'/participants')).$push(cal)
        .then(function(ref) {
          res(ref.key());
        })
        .catch(function(err) {
          rej(err);
        });
      });
    },


    getParticipant : function(id, user, scope, varName) {
      return $firebase(new Firebase(url+'events/'+id+'/participants/'+user))
        .$asObject()
        .$bindTo(scope, varName);
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
      },function(err) {
        console.log('Could not add event', err);
      });
    },


    getEvent : function(id){
      return $q(function(res, rej) {
        var event = $firebase(new Firebase(url+'events/'+id)).$asObject();
        event.$loaded().then(function() {
          if (!event.calendar)
            rej('Event does not exist');
          else
            res(event);
        }).catch(function(err) {
          rej(err);
        });
      });
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
  data.getEvent($routeParams.id).then(function(obj) {
    obj.$bindTo($scope, 'event').then(function() {
      updateCalendar();
      $scope.$watch('event', updateCalendar);
      $scope.daysToFill = new Array('Sun Mon Tue Wed Thu Fri Sat'.split(' ').indexOf(
        $scope.mergedCal.calendar[0].date.substr(0,3)
      ));
      for (var i = 0; i < $scope.daysToFill.length; i++) {
        $scope.daysToFill[i] = i;
      }
    });
  });

  $scope.editName = function(e) {
    $scope.event.name = prompt('Enter a new name for the event', $scope.event.name) || $scope.event.name;
  };

  var showing = false;
  $scope.showCalendar = function(name) {
    showing = true;
    $scope.mergedCal.calendar = _.find($scope.event.participants, {'name': name}).cal;
  };

  $scope.revertCalendar = function() {
    showing = false;
    updateCalendar();
  };

  function updateCalendar() {
    if (!showing){
      $scope.mergedCal = cal.merge(_.cloneDeep($scope.event));  
    }
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
               'ngTouch',
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
      $scope.$apply();
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
  
  data.getEventsForUser($scope, 'events');

  $scope.addEvent = function(){
    $location.path('/events/new').search('name', $scope.newEvent); 
  };

  $scope.removeEvent = function(id) {
    if(confirm("This will delete the event. Are you sure?"))
      data.removeEvent(id);
  };

}]);

}());

;(function () {
'use strict';

angular.module('show', ['ngRoute', 'ngTouch', 'dataFactory'])

.config(['$routeProvider', function($routeProvider){
  $routeProvider
  .when('/event/:id', {
    templateUrl : 'views/show.html',
    controller : 'ShowController',
    controllerAs : 'vm'
  });
}])  

.controller('ShowController', ['$location', '$scope', 'data', '$routeParams', '$route', '$swipe', 
                      function( $location,   $scope,   data,   $routeParams,   $route,   $swipe){
  var id = $routeParams.id,
      days = 'Sun Mon Tue Wed Thu Fri Sat'.split(' ');
  $scope.days = _.zip(days, '0 1 2 3 4 5 6'.split(' '));
  $scope.noUser = false;
  data.getEvent(id).then(function(obj) {
    $scope.event = obj;
  }).catch(function(err) {
    alert(err);
    $location.path('/');
  });

  if(localStorage[id]){
    data.getParticipant(id, localStorage[id], $scope, 'calendar').then(initializeCalendar);
  }
  else{
    $scope.noUser = true;
  }

  $scope.createCalendar = function() {
    $scope.noUser = false;
    var newParticipant = {};
    newParticipant.name = $scope.userName;
    newParticipant.email = $scope.email;
    newParticipant.cal = _.clone($scope.event.calendar);
    data.addParticipant(newParticipant, id)
    .then(function(key) {
      localStorage[id] = key;
      data.getParticipant(id, localStorage[id], $scope, 'calendar').then(initializeCalendar);
    });
  };

  $scope.cannotAttend = function() {
    $scope.calendar.unavailable = !$scope.calendar.unavailable;
    if(!$scope.calendar.unavailable){
      _.forEach($scope.calendar.cal, function(day) {
        day.morning = day.noon = day.night = true;
      });
    }
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
    checkAvailability();
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
    checkAvailability();
  };

  function initializeCalendar() {
    $scope.daysToFill = new Array(days.indexOf($scope.calendar.cal[0].date.substr(0,3)));
    for (var i = 0; i < $scope.daysToFill.length; i++) {
      $scope.daysToFill[i] = i;
    }
  }

  function checkAvailability() {
    var unavailable = true,
        cal = $scope.calendar.cal,
        cur;
    for (var i = 0; i < cal.length; i++) {
      if(cal[i].morning || cal[i].noon || cal[i].night){
        unavailable = false;
      }
    }
    $scope.calendar.unavailable = unavailable;
  }

  var $selector, X, Y, state;
  $scope.beginSelection = function(e) {
    e.preventDefault();
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
    e.preventDefault();
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
    e.preventDefault();
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
    checkAvailability();
    return false;
  }
  
}]);

}());
