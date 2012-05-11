(function($) {
  $.plugin('story_item', (function(){
    function itemPlugin(item) {
      return wikimate.plugins[item.type] || wikimate.plugins.unknown;
    }

    function renderByPlugin($this) {
      var item = $this.story_item('data');
      // add another div inside for removing conflict highlighting with text area
      // after changed to edit mode
      // it's also easier to keep item div element clean
      var content = $('<div />').addClass('item-content');
      var plugin = itemPlugin(item);
      plugin.emit.apply($this, [content, item]);
      plugin.bind.apply($this, [content, item]);
      initActionBar(content);

      return $this.html(content);
    }

    function editByPlugin($this) {
      var item = $this.story_item('data');
      return itemPlugin(item).edit.apply($this, [item]);
    }

    function initItem(data) {
      var item = $.extend({id: wikimate.utils.generateId(), type: wikimate.default_story_item_type}, data || {});
      var plugin = itemPlugin(item);
      item = plugin.defaultData === undefined ? item : _.defaults(item, plugin.defaultData());
      return _.defaults(item, {text: ''});
    }

    var initActionBar = (function() {
      function createEditLink($this) {
        return $('<a href="javascript:void(0)" title="Click me or double click the content to edit">Edit</a>').on('click', function(e) {
          return $this.parent().story_item('edit');
        });
      }
      function createDeleteLink($this) {
        return $('<a href="javascript:void(0)" title="Remove section">Del</a>').on('click', function(e) {
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

      return function($this) {
        return $this.hover(function(e) {
          var bar = $('<div />').addClass('item-action-bar')
            .append(createDeleteLink($this))
            .append(createEditLink($this))
            .append(createHandle());
          $this.append(bar);
        }, function(e) {
          $this.find('.item-action-bar').remove();
        });
      };
    })();

    var status;

    return {
      init: function(options) {
        var item = initItem(options.data);
        this.data('data', item);
        return this.addClass('item ' + item.type)
          .prop("id", item.id)
          .data('newItem', options.newItem)
          .story_item('render');
      },

      newItem: function() {
        return this.data('newItem');
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
        return editByPlugin(this);
      },

      data: function(newData) {
        if (newData) {
          return this.data('data', newData);
        } else {
          return this.data('data');
        }
      },

      render: function() {
        return renderByPlugin(this.story_item('status', 'rendering item'));
      },

      cancel: function() {
        return this.story_item('save', this.story_item('data').text);
      },

      save: function(text) {
        var item = this.story_item('data');
        if (text === '') {
          this.story_item('remove');
        } else if (this.data('newItem') || text != item.text) {
          this.story_item('update', {text: text});
        } else {
          this.story_item('render');
        }
        return this;
      },

      remove: function() {
        this.story_item('status', 'removing item');
        if (this.data('newItem')) {
          this.remove();
        } else {
          this.removeClass('item'); // remove item class to mark item has been deleted
          this.trigger(wikimate.events.CHANGE, {id: this.story_item('data').id, type: 'remove', inside: this.parents('.item:first').prop('id')});
          this.remove();
        }
      },

      update: function(changes) {
        this.story_item('status', 'updating item');
        var item = $.extend(this.story_item('data'), changes);
        if (this.data('newItem')) {
          renderByPlugin(this.removeData('newItem'));
          this.trigger(wikimate.events.CHANGE, {
            id: item.id,
            type: 'add',
            item: wikimate.utils.deepClone(item),
            after: this.prev().prop('id'),
            inside: this.parents('.item:first').prop('id')
          });
        } else {
          renderByPlugin(this);
          this.trigger(wikimate.events.CHANGE, {
            id: item.id,
            type: 'edit',
            item: wikimate.utils.deepClone(item),
            inside: this.parents('.item:first').prop('id')
          });
        }
        return this;
      },

      moved: function(moveInfo) {
        this.story_item('status', 'moved item');
        this.trigger(wikimate.events.CHANGE, {
          id: this.prop('id'),
          type: 'move',
          order: moveInfo.order,
          inside: this.parents('.item:first').prop('id')
        });
        return this;
      }
    };
  })());
})(jQuery);
