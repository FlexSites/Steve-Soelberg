angular.module('SteveSoelberg')
  .config(['$stateProvider', function($stateProvider) {
    $stateProvider
      .state('bio', {
        url: '/bio',
        templateUrl: '/html/bio.html',
        controller: 'BioCtrl',
        controllerAs: 'bio',
        resolve: {
          entertainer: ['FlexEntertainer', function(Entertainer) {
            return Entertainer
              .query()
              .$promise
              .then(function(entertainers) { return entertainers[0] || {}; })
          }],
        },
      })
  }])
  .controller('BioCtrl', ['entertainer', function(entertainer) {
    var self = this;

    self.entertainer = entertainer;
  }])
