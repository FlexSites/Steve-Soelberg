angular.module('SteveSoelberg')
  .controller('MainCtrl', [ function (){
    document.title = 'Official Website Of Steve Soelberg';
    console.log('Ran main ctrl');
    document.title = this.title = 'Crazy crap and stuff';
    this.shareImage = 'http://localhost:8080/img/shareImage.jpg';
  }]);

