var app = angular.module('comedian', ['ngRoute'])
    .config(['$routeProvider', '$locationProvider',
        function($routeProvider, $locationProvider) {
            angular.forEach(<@&routes@>, function(route) {
                var url = route.url;
                delete route.url;
                $routeProvider.when(url, route);
            });
            $locationProvider.html5Mode(true);
        }
    ])
    // Whitelist resource sharing
    .config(['$sceDelegateProvider',function($sceDelegateProvider){
        $sceDelegateProvider.resourceUrlWhitelist([
            'self',
            'http://*.youtube.com/**',
            'https://*.youtube.com/**'
        ]);
    }])
    .controller('MediaController', ['$scope','$http',
        function($scope,$http) {
            console.log('Media Controller');
            $http.get('http://<@env@>api.comedian.io/media').success(function(data) {
                console.log('success', arguments);
                $scope.items = data;
            }).error(function() {
                console.log('error', arguments);
            });
        }
    ])
    .controller('EmailList', ['$scope', '$http',
        function($scope, $http) {
            $http.get('http://<@env@>api.comedian.io/events').success(function() {
                console.log('Success', arguments);
            }).error(function() {
                console.log('Failure', arguments);
            });
            $scope.subscriber = {
                email: '',
                zip: '',
                name: ''
            };
            var that = this;
            this.submitted = false;
            $scope.saveData = function() {
                console.log('Hey', this.subscriber);
                $http.post('http://<@env@>api.comedian.io/subscribers', $scope.subscriber)
                    .success(function(data) {
                        that.submitted = true;
                        that.message = data.message;
                    });
            };
        }
    ])
    .controller('ContactForm', ['$scope', '$http',
        function($scope, $http) {
            $scope.contact = {
                name: '',
                phone: '',
                email: '',
                message: ''
            };
            this.submitted = false;
            var that = this;
            $scope.saveData = function() {
                $http.post('http://<@env@>api.comedian.io/mail/send', $scope.contact)
                    .success(function(data) {
                        that.submitted = true;
                        that.message = data.message;
                    });
            };
        }
    ])
    .run(['$location', '$rootScope', '$http',
        function($location, $rootScope, $http) {
            // $rootScope.bgClass = 'bg-home';
            $rootScope.$on('$routeChangeSuccess', function(event, current, previous) {
                if (current) {
                    console.log(current);
                    document.title = current.$$route.title;
                    $rootScope.bgClass = current.$$route.bgClass;
                }
            });
        }
    ]);


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
/********************
 * CRITICAL PATH GLOBAL SCRIPT
 * Script that page loading and other scripts depend on
 ********************/

//Generic type validation
(function(w){
    var objectTypes = ['String','Number','Undefined','Object','Function','Boolean'],
        callback = function(type){
            w['is'+type] = function(x){
                return typeof x===type.toLowerCase();
            };
        };
    for(var i = objectTypes.length;i--;){
        callback(objectTypes[i]);
    }
}(window));

//String validation
function isArray(arr){
    return isObject(arr)&&Array.isArray(arr);
}
function isURL(url){
    return isString(url)&&/^(https?:\/\/|\/)/.test(url);
}

//Helper Methods
function define(variable,defaultValue){
    if(isUndefined(this[variable]))this[variable] = isUndefined(defaultValue)?'':defaultValue;
}
function slugify(str){
    return (str||'').replace(/[^a-zA-Z0-9]+/g,'-').toLowerCase();
}

define('analytics','UA-42233857-2');
define('_plugins',[]);
define('noop',function(){});

//Script & Stylesheet Loader
(function(w,d){
    var body = d.getElementsByTagName('body')[0],critical = d.getElementById('critical-js'),styles = d.getElementById('styles-css')
    w.loadJS = function(src,callback){
        loadFile('script',src,callback);
    };
    w.loadCSS = function(src){
        loadFile('link',src);
    };
    w.load = function(file,callback){
        if(!isString(file))for(var i = 0;i<file.length;i++)load(file[i],callback);
        else if(_plugins[file])load(_plugins[file],callback);
        else file.split('.').pop()==='js'?loadJS(file,callback):loadCSS(file,callback);
    };
    function loadFile(type,src,callback){
        var isScript = type==='script',elem = d.createElement(type),listener;
        if(d.getElementById(elem.id = slugify(src.replace(/.*[/]/,''))))return callback&&callback(src);
        if(isScript){
            elem.defer = elem.async = elem.src = formatResource(src);
            if(isFunction(callback)){
                elem.addEventListener('load',listener = function(){
                    callback(src);
                    elem.removeEventListener('load',listener,false);
                },false);
            }
        }
        else {
            elem.href = src;
            elem.type = 'text/css';
            elem.rel = 'stylesheet';
        }
        body.insertBefore(elem,isScript?critical:styles);
    }
}(window,document));

//Google Analytics
if(analytics){
    (function(a,b){
        a.GoogleAnalyticsObject = b;
        a[b] = a[b]||function(){
            (a[b].q = a[b].q||[]).push(arguments);
        };
        a[b].l = 1*new Date;
        load(['//www.google-analytics.com/analytics.js','//www.google-analytics.com/plugins/ua/linkid.js']);
    })(window,"ga");
    
    ga('create',analytics,location.hostname);
    ga('require','displayfeatures');
    ga('require','ecommerce','ecommerce.js');
    ga('send','pageview');
}
else {
    window.ga = noop;
}