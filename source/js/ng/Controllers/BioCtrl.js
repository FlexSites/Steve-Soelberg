angular.module('SteveSoelberg')
  .config(['$stateProvider', function($stateProvider) {
    $stateProvider
      .state('bio', {
        url: '/bio',
        templateUrl: '/html/bio.html',
        controller: 'BioCtrl',
        controllerAs: 'bio',
        resolve: {
          entertainer: ['FlexEntertainer', '$sce', function(Entertainer, $sce) {
            return Entertainer
              .query()
              .$promise
              .then(function(entertainers) { return entertainers[0] || {}; })
              .then(function(entertainer) {
                entertainer.description = $sce.trustAsHtml(entertainer.description);
                return entertainer;
              })
          }],
        },
      })
  }])
  .controller('BioCtrl', ['entertainer', function(entertainer) {
    var self = this;

    self.entertainer = entertainer;
  }])
