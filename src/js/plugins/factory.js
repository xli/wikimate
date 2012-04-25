(function($) {
  wikimate.plugins.factory = {
    emit: function(div, item) {
      var $this = this;
      var list = $('<ul/>');
      for (var prop in wikimate.plugins) {
        if (prop == 'factory') {
          continue;
        }
        var link = $('<a href="javascript:void(0)"/>').addClass('add_' + prop).html("Add a " + prop).click(function(e) {
          var items = $this.parent();
          $this.story_item('remove');
          items.story('newItem', {type: prop});
        });
        $('<li/>').html(link).appendTo(list);
      }
      this.data('newItem', true);
      return div.html(list);
    },
    edit: function() {
    },
    bind: function(div, item) {
    }
  };
})(jQuery);
