;(function () {
'use strict';

angular.module('authFactory', [])
.factory('auth', ['$location', '$rootScope', function($location, $rootScope) {
  var ref = new Firebase('https://when1021.firebaseio.com/');
  return {
    login: function(usr, cb) {
      ref.authWithPassword(usr, function(err, authData){
        if(authData) {$rootScope.user = authData;}
        cb(err,authData);
      });
    },
    logout : function() {
      ref.unauth();
      $rootScope.user = null;
    },
    authenticate : function(){
      var authCred = ref.getAuth();
      $rootScope.user = authCred;
      return authCred;
    }
  };
}]);

}());
