$(function(){
  var $testimonials = $('.testimonial');

  var idx = 0;
  function setActive(){
    $('.testimonial_-active').removeClass('testimonial_-active');
    if(idx >= $testimonials.length) idx = 0;
    $testimonials.eq(idx++).addClass('testimonial_-active');
    return setActive;
  }

  setInterval(setActive(), 7500);
});
