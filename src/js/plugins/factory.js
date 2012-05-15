(function($) {
  function transform(story_item_element, type) {
    return story_item_element.empty().removeClass('factory').story_item({data: {type: type}, newItem: true});
  }

  wikimate.plugins.factory = {
    emit: function(div, item) {
      var list = $('<ul/>');
      for (var prop in wikimate.plugins) {
        var title = wikimate.plugins[prop].title;
        if (title) {
          var link = $('<a href="javascript:void(0)"/>')
            .addClass('new-plugin-item-link new-' + prop)
            .text(title)
            .data('plugin', prop);
          $('<li/>').html(link).appendTo(list);
        }
      }
      this.data('newItem', true);
      return div.html('Double-Click to Edit or Add:').append(list);
    },
    edit: function(div, item) {
      return transform(this, wikimate.default_story_item_type).story_item('edit');
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
