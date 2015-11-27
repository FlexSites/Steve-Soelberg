angular.module('SteveSoelberg')
  .config(['$stateProvider', function($stateProvider) {
    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: '/html/home.html',
        controller: 'HomeCtrl',
        controllerAs: 'home',
        data: {
          title: 'Official website of comedian Steve Soelberg',
          description: 'Steve Soelberg is an incredibly talented stand-up comedian.',
        },
        resolve: {
          testimonials: ['FlexTestimonial', function(Testimonial) {
            console.log('running stuff');
            return Testimonial.query().$promise;
          }],
        },
      })
  }])
  .controller('HomeCtrl', ['$interval', 'testimonials', function($interval, testimonials) {
    var self = this;

    self.testimonials = testimonials;
    self.activeTestimonial = 0;

    $interval(function() {
      self.activeTestimonial++;
      if (self.activeTestimonial >= testimonials.length) {
        self.activeTestimonial = 0;
      }
    }, 7500);
  }]);
