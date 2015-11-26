angular.module('SteveSoelberg')
  .config(['$stateProvider', function($stateProvider) {
    $stateProvider
      .state('media', {
        url: '/media',
        templateUrl: '/html/media.html',
        controller: 'MediaCtrl',
        controllerAs: 'media',
        resolve: {
          media: ['FlexMedium', function(Medium) {
            console.log('running stuff');
            return Medium.query().$promise;
          }],
        },
      })
  }])
  .controller('MediaCtrl', ['$interval', 'media', function($interval, media) {
    var self = this;

    self.media = media;
  }]);
