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
