(function($) {
  wikimate.plugins.unknown = {
    emit: function(div, item) {
      return div.addClass('unknown').text("Unexpected item: " + JSON.stringify({type: item.type, text: item.text}));
    },
    bind: function(div, item) {
    },
    edit: function(item) {
      return false;
    }
  };
})(jQuery);
