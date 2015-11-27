angular.module('SteveSoelberg')
  .run(['$rootScope', function($rootScope) {

  }])
  .controller('MainCtrl', ['$rootScope', function ($rootScope){
    var self = this;
    $rootScope.$on('$stateChangeSuccess', function(event, toState) {
      if (!toState.data) toState.data = {};
      self.title = document.title = toState.data.title || 'Official Website Of Steve Soelberg';
      self.shareImage = toState.data.shareImage || '/img/shareImage.jpg';
      self.description = toState.data.description || 'Default description';
    });
  }]);
