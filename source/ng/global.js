var app = angular.module("app", [ "ngRoute" ]).config([ "$routeProvider", "$locationProvider", function($routeProvider, $locationProvider) {
    angular.forEach([ {
        url: "/",
        templateUrl: "/html/home.html",
        bgClass: "bg-home",
        title: "Comedian Steve Soelberg"
    }, {
        url: "/bio",
        templateUrl: "/html/bio.html",
        bgClass: "bg-bio",
        title: "About Steve"
    }, {
        url: "/contact",
        templateUrl: "/html/contact.html",
        bgClass: "bg-contact",
        title: "Book Steve"
    }, {
        url: "/videos",
        templateUrl: "/html/videos.html",
        bgClass: "bg-media",
        title: "Videos of Steve Soelberg",
        controller: "MediaController"
    }, {
        url: "/calendar",
        templateUrl: "/html/calendar.html",
        bgClass: "bg-calendar",
        title: "See an upcoming performance of Steve"
    } ], function(route) {
        var url = route.url;
        delete route.url;
        $routeProvider.when(url, route);
    });
    $locationProvider.html5Mode(true);
} ]).config([ "$sceDelegateProvider", function($sceDelegateProvider) {
    $sceDelegateProvider.resourceUrlWhitelist([ "self", "http://*.youtube.com/**", "https://*.youtube.com/**" ]);
} ]).controller("MediaController", [ "$scope", "$http", function($scope, $http) {
    console.log("Media Controller");
    $http.get("http://localapi.comedian.io/media").success(function(data) {
        console.log("success", arguments);
        $scope.items = data;
    }).error(function() {
        console.log("error", arguments);
    });
} ]).controller("EmailList", [ "$scope", "$http", function($scope, $http) {
    $http.get("http://localapi.comedian.io/events").success(function() {
        console.log("Success", arguments);
    }).error(function() {
        console.log("Failure", arguments);
    });
    $scope.subscriber = {
        email: "",
        zip: "",
        name: ""
    };
    var that = this;
    this.submitted = false;
    $scope.saveData = function() {
        console.log("Hey", this.subscriber);
        $http.post("http://localapi.comedian.io/subscribers", $scope.subscriber).success(function(data) {
            that.submitted = true;
            that.message = data.message;
        });
    };
} ]).controller("ContactForm", [ "$scope", "$http", function($scope, $http) {
    $scope.contact = {
        name: "",
        phone: "",
        email: "",
        message: ""
    };
    this.submitted = false;
    var that = this;
    $scope.saveData = function() {
        $http.post("http://localapi.comedian.io/mail/send", $scope.contact).success(function(data) {
            that.submitted = true;
            that.message = data.message;
        });
    };
} ]).run([ "$location", "$rootScope", "$http", function($location, $rootScope, $http) {
    $rootScope.$on("$routeChangeSuccess", function(event, current, previous) {
        if (current) {
            document.title = current.$$route.title;
            $rootScope.bgClass = current.$$route.bgClass;
        }
    });
} ]);

function define(variable, defaultValue) {
    if (isUndefined(this[variable])) this[variable] = isUndefined(defaultValue) ? "" : defaultValue;
}

function slugify(str) {
    return (str || "").replace(/[^a-zA-Z0-9]+/g, "-").toLowerCase();
}