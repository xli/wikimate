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

    newItem: function() {
      $('<div/>').story_item({newItem: true}).appendTo(this).story_item('edit');
      return this;
    },

    bindChangeEvents: function() {
      var $this = this;
      return this.sortable({
        handle: '.item-handle',
        start: function(event, ui) {
          $this.data('snapshot', _.compact(_.pluck($this.find('.item'), 'id')));
        },
        update: function(event, ui) {
          ui.item.story_item('moved', {
            prevOrder: $this.data('snapshot'),
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
    var Handle = (function() {
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
      return {
        appendTo: function(div) {
          var handle = createHandle();
          // delegate event?
          div.append(handle).hover(function(e) {
            handle.show();
          }, function(e) {
            handle.hide();
          });
        }
      };
    })();

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
      Handle.appendTo(content);
      return $this.html(content);
    }

    var status;

    return {
      init: function(options) {
        var item = this.story_item('data', options.data || {}).story_item('data');
        var $this = this;
        return this.addClass('item ' + item.type)
          .attr("id", item.id)
          .data('newItem', options.newItem)
          .on(wikimate.events.EDIT, function(e) { $this.wikimate_text_editor('init'); })
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
        return this.trigger(wikimate.events.EDIT);
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
          this.trigger(wikimate.events.CHANGE, action('remove', this.story_item('data'), this.prev().attr('id')));
          this.remove();
        }
      },

      save: function(changes) {
        this.story_item('status', 'saving item');
        var item = $.extend(this.story_item('data'), changes);
        if (this.data('newItem')) {
          renderByPlugin(this.removeData('newItem')).trigger(wikimate.events.CHANGE, action('add', item, this.prev().attr('id')));
        } else {
          renderByPlugin(this).trigger(wikimate.events.CHANGE, action('edit', item));
        }
        return this;
      },

      moved: function(moveInfo) {
        this.story_item('status', 'moved item');
        this.trigger(wikimate.events.CHANGE, {
          id: this.attr('id'),
          type: 'move',
          prevOrder: moveInfo.prevOrder,
          order: moveInfo.order
        });
      }
    };
  })());

  $.extend(wikimate.events, {
    CHANGE: 'wikimate:change',
    EDIT: 'wikimate:edit'
  });

  $.extend(wikimate.fn, {
    newItem: function() {
      return this.find('.wikimate-story').story('newItem');
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
