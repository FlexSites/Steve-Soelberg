angular.module('SteveSoelberg')
  .config(['$stateProvider', function($stateProvider) {
    $stateProvider
      .state('contact', {
        url: '/contact',
        templateUrl: '/html/contact.html',
        controller: 'ContactCtrl',
        controllerAs: 'contact',
      })
  }])
  .controller('ContactCtrl', ['FlexSubscriber', 'FlexContactMessage', function(Subscriber, ContactMessage) {
    var self = this;

    self.message = new ContactMessage();
    self.subscriber = new Subscriber();
    self.subscriberForm = {};
    self.contactForm = {};

    self.subscribe = function(isValid) {
      delete self.errorMessage;
      delete self.subscriberForm.successMessage;
      if (!isValid) return self.errorMessage = 'Please enter all required fields';
      self
        .subscriber
        .$save(function(data) {
          self.subscriberForm.successMessage = 'Thanks! You\'re now part of one of the funniest email lists ever!';
          console.log('callback', data);
        }, function (err) {
          self.errorMessage = err.message || 'Server error';
        });
    };

    self.send = function(isValid) {
      if (!isValid) return self.errorMessage = 'Please enter all required fields';
      self
        .message
        .$save(function(data) {
          self.contactForm.successMessage = 'Thanks! Your message is on it\'s way!';
          console.log('callback', data);
        }, function (err) {
          self.errorMessage = err.message || 'Server error';
        });
    }
  }]);
