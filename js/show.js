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
      var part = data.getParticipant(id, localStorage[id]);
      part.$bindTo($scope, 'calendar').then(initializeCalendar);
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
    console.log('checked');
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
