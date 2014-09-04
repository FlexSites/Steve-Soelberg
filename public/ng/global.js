var app = angular.module('comedian',['ngRoute'])
    .config(['$routeProvider','$locationProvider',function($routeProvider,$locationProvider) {
        $routeProvider
            .when('/', {
                templateUrl : '/html/home.html',
                bgClass: 'bg-home',
                title: 'Comedian Steve Soelberg'
            })
            .when('/bio', {
                templateUrl : '/html/bio.html',
                bgClass: 'bg-bio',
                title: 'About Steve'
            })
            .when('/contact', {
                templateUrl : '/html/contact.html',
                // controller  : 'contactController',
                    bgClass: 'bg-contact',
                    title: 'Book Steve'
            })
            .when('/videos', {
                templateUrl: '/html/videos.html',
                bgClass: 'bg-media',
                title: 'Videos of Steve Soelberg'
            })
            .when('/calendar', {
                templateUrl: '/html/calendar.html',
                bgClass: 'bg-calendar',
                title: 'See an upcoming performance of Steve'
            })
            $locationProvider.html5Mode(true);
    }])
    .run(['$location', '$rootScope', function($location, $rootScope) {
        // $rootScope.bgClass = 'bg-home';
        $rootScope.$on('$routeChangeSuccess', function (event, current, previous) {
            if(current){
                document.title = current.$$route.title;
                $rootScope.bgClass = current.$$route.bgClass;
            }
        });
    }]);
    // $(function(){
    //     $(document).on('click','#menu',function(){
    //         $(this).toggleClass('open');
    //     });
    //     var img = new Image();
    //     img.onload = function(){
    //         $('html').css('background-image','url('+img.src+')');
    //     };
    //     img.src = "/media/large/contact.jpg";
    // });