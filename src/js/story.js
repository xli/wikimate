(function($) {

  $.plugin('story', {
    init: function(items) {
      var $this = this;
      $.each(items || [], function(i, item) {
        $('<div/>').story_item({data: item}).appendTo($this);
      });
      return this.addClass('wikimate-story').story('bindChangeEvents').story('dblclickToNewItem');
    },

    execute: function(action) {
      var item;
      action = wikimate.utils.deepClone(action);
      if (action.inside) {
        item = $('#' + action.inside);
        var itemStory = item.find('.wikimate-story:first');
        itemStory.story('execute', _.extend(action, {inside: null}));
        item.story_item('data').story = itemStory.story('data');
        return this;
      }

      if (action.type == 'add') {
        item = $('<div/>').story_item({data: action.item});
        if (action.after) {
          item.insertAfter($('#' + action.after));
        } else {
          item.prependTo(this);
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
    newItem: function(data, position) {
      if (position && position.inside) {
        return $('#' + position.inside + ' .wikimate-story:first').story('newItem', data, {after: position.after});
      }
      var item = $('<div/>').story_item({newItem: true, data: data});
      if (position && position.after) {
        return item.insertAfter($('#' + position.after));
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

  window.wikimate.default_story_item_type = 'paragraph';
  $.extend(wikimate.fn, {
    newItem: function(data, position) {
      return this.find('> .wikimate-story').story('newItem', data, position);
    },
    story: function(options) {
      if (options) {
        if (options.change) {
          this.on(wikimate.events.CHANGE, options.change);
        }
        if (options.default_story_item_type) {
          wikimate.default_story_item_type = options.default_story_item_type;
        }
        var storyElement = $('<div />').story('init', options.story);
        var newFactoryItem = $('<div title="Add new Item">[+]</a>').addClass('add-new-factory').on('click', function(e) {
          return storyElement.story('newItem', {type: 'factory'});
        });

        return this.append(storyElement).append(newFactoryItem);
      } else {
        return this.find('> .wikimate-story').story('data');
      }
    }
  });
})(jQuery);
