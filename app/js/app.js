(function() {
  angular.module('when', []).controller('MainController', [
    '$location', function($location) {
      var vm;
      vm = this;
      return vm.name = 'Colby';
    }
  ]);

}).call(this);

(function() {
  angular.module('when', ['ngRoute']);

}).call(this);
