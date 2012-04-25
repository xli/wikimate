(function($) {
  wikimate.plugins.factory = {
    emit: function(div, item) {
      var list = $('<ul/>');
      for (var prop in wikimate.plugins) {
        if (prop == 'factory' || prop == 'paragraph') {
          continue;
        }
        var title = wikimate.plugins[prop].title;
        var link = $('<a href="javascript:void(0)"/>').addClass('new-plugin-item-link new-' + prop).html(title).data('plugin', prop);
        $('<li/>').html(link).appendTo(list);
      }
      this.data('newItem', true);
      return div.html('Double-Click to Edit or Add:').append(list);
    },
    edit: function() {
      return this.removeClass('factory')
        .addClass('paragraph')
        .story_item('data', {type: 'paragraph'})
        .story_item('edit');
    },
    bind: function(div, item) {
      var itemEle = this;
      div.find('.new-plugin-item-link').click(function(e) {
        var type = $(this).data('plugin');
        itemEle.removeClass('factory').addClass(type);
        itemEle.story_item({newItem: true, data: {type: type}}).story_item('edit');
      });
      div.on('dblclick', function(e) {
        if (itemEle.story_item('editable')) {
          itemEle.story_item('edit');
        }
      });
    }
  };
})(jQuery);
