/* jshint jquery:true */

$(function(){
  var isEmail = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i
    , $requiredMessage = $('#requiredMessage');

  $('#message-form, #subscribe-form').on('submit', function(){
    var fields = ['name','email']
      , isSubscriber = $(this).is('#subscribe-form')
      , valid = true;

    if(!isSubscriber) fields.push('phone','body');

    var form = fields.reduce(function(prev, curr){
      var id = curr;
      if(isSubscriber) id = 'sub-' + id;
      var $el = $('#'+id)
        , val = $.trim($el.val());

      if(($el.attr('type') === 'email' && !isEmail.test(val)) || ($el.prop('required') && !val.length)){
        handleError($el);
        valid = false;
      }
      prev[curr] = val;
      return prev;
    },{});

    if(!valid) return;

    $.ajax({
      url: '/api/v1/' + (isSubscriber?'subscribers':'contact-messages'),
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      method: 'POST',
      data: JSON.stringify(form),
      success: function() {
        $requiredMessage.hide();
        $('#' + (isSubscriber?'subscribe':'message') + '-form').hide();

        var msg = isSubscriber ? 'Thanks! You\'re now part of one of the funniest email lists ever!' : 'Thanks! Your message is on it\'s way!';
        $('#' + (isSubscriber?'subscribe':'message') + '-confirm').text(msg).show();
      },
      error: function(){
        // TODO: Handle error case
      }
    });
    return false;
  });

  function handleError($el){
    $el.addClass('background-red').focus();
    $('#requiredMessage').show();
    event.preventDefault();
  }
});


