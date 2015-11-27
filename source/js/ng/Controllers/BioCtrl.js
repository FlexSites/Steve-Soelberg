angular.module('SteveSoelberg')
  .config(['$stateProvider', function($stateProvider) {
    $stateProvider
      .state('bio', {
        url: '/bio',
        templateUrl: '/html/bio.html',
        controller: 'BioCtrl',
        controllerAs: 'bio',
        data: {
          title: 'About Steve Soelberg',
          description: 'Extremely funny comedian and overall nice person Steve Soelberg brings an observational, story telling style of comedy which has repeatedly left his regularly sold out audiences in stitches.',
        },
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
