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
      return $.map(this.find('.item'), function(ele) {
        return $(ele).story_item('data');
      });
    },

    newItem: function(data) {
      $('<div/>').story_item({newItem: true, data: data}).appendTo(this).story_item('edit');
      return this;
    },

    bindChangeEvents: function() {
      var $this = this;
      return this.sortable({
        handle: '.item-handle',
        forcePlaceholderSize: true,
        placeholder: 'sort-placeholder',
        update: function(event, ui) {
          ui.item.story_item('moved', {
            order: _.pluck($this.find('.item'), 'id')
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
          $this.story('newItem');
        }
      });
    }
  });

  $.plugin('story_item', (function(){

    function action(type, item, after) {
      return {
        id: item.id,
        type: type,
        item: $.extend({}, item),
        after: after
      };
    }

    function renderByPlugin($this) {
      var item = $this.story_item('data');
      var plugin = wikimate.plugins[item.type];
      // add another div inside for removing conflict highlighting with text area
      // after changed to edit mode
      var content = $('<div />').addClass('item-content');
      plugin.emit.apply($this, [content, item]);
      plugin.bind.apply($this, [content, item]);
      initActionBar(content);
      return $this.html(content);
    }


    function createEditLink($this) {
      return $('<a href="javascript:void(0)" title="Click me or double click the content to edit">Edit</a>').on('click', function(e) {
        return $this.parent().story_item('edit');
      });
    }
    function createDeleteLink($this) {
      return $('<a href="javascript:void(0)" title="Click me to remove the content">Del</a>').on('click', function(e) {
        return $this.parent().story_item('remove');
      });
    }

    var cursor = {
      grab: function() {
        return this.css('cursor', 'grab').css('cursor', '-moz-grab').css('cursor', '-webkit-grab');
      },
      grabing: function() {
        return this.css('cursor', 'grabbing').css('cursor', '-moz-grabbing').css('cursor', '-webkit-grabbing');
      }
    };
    function createHandle() {
      var handle = $('<div />').addClass('item-handle').extend(cursor).grab();
      return handle.mousedown(function(e) {
        handle.grabing();
      }).mouseup(function() {
        handle.grab();
      });
    }

    function initActionBar($this) {
      var bar = $('<div />').addClass('item-action-bar')
        .append(createDeleteLink($this))
        .append(createEditLink($this))
        .append(createHandle());
      return $this.append(bar).hover(function(e) {
        bar.show();
      }, function(e) {
        bar.hide();
      });
    }

    var status;

    return {
      init: function(options) {
        var item = this.story_item('data', options.data || {}).story_item('data');
        var $this = this;
        return this.addClass('item ' + item.type)
          .prop("id", item.id)
          .data('newItem', options.newItem)
          .story_item('render');
      },

      status: function(newStatus) {
        if (newStatus) {
          status = newStatus;
          _.delay(function() { status = undefined; }, 100);
          return this;
        } else {
          return status;
        }
      },

      editable: function() {
        return status === undefined;
      },

      edit: function() {
        return this.wikimate_text_editor('init');
      },

      data: function(attrs) {
        if (attrs) {
          var item = {id: wikimate.utils.generateId(), type: 'paragraph', text: ''};
          if (attrs) {
            $.extend(item, attrs);
          }
          return this.data('data', item);
        } else {
          return this.data('data');
        }
      },

      render: function() {
        return renderByPlugin(this.story_item('status', 'rendering item'));
      },

      remove: function() {
        this.story_item('status', 'removing item');
        if (this.data('newItem')) {
          this.remove();
        } else {
          this.trigger(wikimate.events.CHANGE, {id: this.story_item('data').id, type: 'remove'});
          this.remove();
        }
      },

      save: function(changes) {
        this.story_item('status', 'saving item');
        var item = $.extend(this.story_item('data'), changes);
        if (this.data('newItem')) {
          renderByPlugin(this.removeData('newItem')).trigger(wikimate.events.CHANGE, action('add', item, this.prev().prop('id')));
        } else {
          renderByPlugin(this).trigger(wikimate.events.CHANGE, action('edit', item));
        }
        return this;
      },

      moved: function(moveInfo) {
        this.story_item('status', 'moved item');
        this.trigger(wikimate.events.CHANGE, {
          id: this.prop('id'),
          type: 'move',
          order: moveInfo.order
        });
      }
    };
  })());

  $.extend(wikimate.events, {
    CHANGE: 'wikimate:change'
  });

  $.extend(wikimate.fn, {
    newItem: function(data) {
      return this.find('.wikimate-story').story('newItem', data);
    },
    story: function(options) {
      if (options) {
        if (options.change) {
          this.on(wikimate.events.CHANGE, options.change);
        }
        return this.append($('<div />').addClass('wikimate-story').story('init', options.story));
      } else {
        return this.find('.wikimate-story').story('data');
      }
    }
  });
})(jQuery);
