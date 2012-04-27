(function($) {
  function transform(story_item_element, type) {
    return story_item_element.empty().removeClass('factory').story_item({data: {type: type}, newItem: true});
  }

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
      return transform(this, 'paragraph').story_item('edit');
    },
    bind: function(div, item) {
      var itemEle = this;
      div.find('.new-plugin-item-link').click(function(e) {
        transform(itemEle, $(this).data('plugin')).story_item('edit');
      });
      div.on('dblclick', function(e) {
        if (itemEle.story_item('editable')) {
          itemEle.story_item('edit');
        }
      });
    }
  };
})(jQuery);
