angular.module('app')
    .controller('HomeCtrl', ['$scope', '$interval', function($scope, $interval){
        var testimonials = [
        {
            quote: "Work Christmas party, booked Steve Soelberg for our entertainment, he is amazing! Anyone that can make a room full of accountants laugh has some mad skills! Thank you Steve!",
            author: "Wendy Duke",
            company: "Harman Management Corp"
        }, {
            quote: "Steve Soelberg is hilarious! Great timing. Great comedic insights. Everyone on my team laughed and smiled for an hour straight.... just what I had hoped for. I look forward to seeing Steve's act again.",
            author: "Michael Janda",
            company: "CEO of RiSER"
        }
        ];
        var i = 0;
        $scope.testimonial = testimonials[i];
        $interval(function(){
            console.log(testimonials[i % 2]);
            $scope.testimonial = testimonials[++i % 2];
        }, 7500);
    }]);