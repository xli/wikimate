(function($) {

  $.plugin('story', {
    init: function(items) {
      var $this = this;
      $.each(items || [], function(i, item) {
        $this.append($('<div/>').story_item({data: item}));
      });
      return this.story('bindChangeEvents').story('dblclickToNewItem');
    },

    execute: function(action) {
      if (action.type == 'add') {
        var item = $('<div/>').story_item({data: action.item});
        if (action.after) {
          item.insertAfter('#' + action.after);
        } else {
          this.prepend(item);
        }
        item.effect('highlight');
      } else if (action.type == 'remove') {
        $('#' + action.id).removeClass('item').effect("explode", {}, 'normal', function() {
          $(this).remove();
        });
      } else if (action.type == 'edit') {
        $('#' + action.id).story_item('data', action.item).story_item('render').effect("highlight");
      } else if (action.type == 'move') {
        var pos = action.order.indexOf(action.id);
        var target = $('#' + action.id);
        if (pos === 0) {
          this.prepend(target);
        } else {
          target.insertAfter($('#' + action.order[pos - 1]));
        }
        target.effect("highlight");
      }
      return this;
    },

    data: function() {
      return $.map(this.find('> .item'), function(ele) {
        return $(ele).story_item('data');
      });
    },

    // return item element instead of story
    newItem: function(data, after) {
      var item = $('<div/>').story_item({newItem: true, data: data});
      if (after) {
        return item.insertAfter($('#' + after));
      } else {
        return item.appendTo(this);
      }
    },

    bindChangeEvents: function() {
      var $this = this;
      return this.sortable({
        handle: '.item-handle',
        forcePlaceholderSize: true,
        placeholder: 'sort-placeholder',
        opacity: 0.8,
        update: function(event, ui) {
          ui.item.story_item('moved', {
            order: _.pluck($this.find('> .item'), 'id')
          });
        }
      });
    },

    dblclickToNewItem: function() {
      var $this = this;
      return this.dblclick(function(e) {
        e.preventDefault();
        e.stopPropagation();
        if (e.target == $this[0]) {
          $this.story('newItem').story_item('edit');
        }
      });
    }
  });

  $.extend(wikimate.events, {
    CHANGE: 'wikimate:change'
  });

  $.extend(wikimate.fn, {
    newItem: function(data, after) {
      return this.find('> .wikimate-story').story('newItem', data, after);
    },
    story: function(options) {
      if (options) {
        if (options.change) {
          this.on(wikimate.events.CHANGE, options.change);
        }
        var storyElement = $('<div />').addClass('wikimate-story').story('init', options.story);
        var toolbarElement = $('<div/>').addClass('wikimate-toolbar').wikimate_toolbar('init');
        return this.append(storyElement).append(toolbarElement);
      } else {
        return this.find('> .wikimate-story').story('data');
      }
    }
  });
})(jQuery);
