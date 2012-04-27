(function($) {
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
      // it's also easier to keep item div element clean
      var content = $('<div />').addClass('item-content');
      plugin.emit.apply($this, [content, item]);
      plugin.bind.apply($this, [content, item]);
      initActionBar(content);
      return $this.html(content);
    }

    function editByPlugin($this) {
      var item = $this.story_item('data');
      var plugin = wikimate.plugins[item.type];
      return plugin.edit.apply($this, [item]);
    }

    var initActionBar = (function() {
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

      return function($this) {
        var bar = $('<div />').addClass('item-action-bar')
          .append(createDeleteLink($this))
          .append(createEditLink($this))
          .append(createHandle());
        return $this.append(bar).hover(function(e) {
          bar.show();
        }, function(e) {
          bar.hide();
        });
      };
    })();

    var status;

    return {
      init: function(options) {
        var default_data = {id: wikimate.utils.generateId(), type: 'paragraph', text: ''}
        var item = $.extend(default_data, options.data || {});
        this.data('data', item);
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

      save: function(text) {
        var item = this.story_item('data');
        if (text === '') {
          this.story_item('remove');
        } else if (text != item.text) {
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
          this.trigger(wikimate.events.CHANGE, {id: this.story_item('data').id, type: 'remove'});
          this.remove();
        }
      },

      update: function(changes) {
        this.story_item('status', 'updating item');
        var item = $.extend(this.story_item('data'), changes);
        if (this.data('newItem')) {
          renderByPlugin(this.removeData('newItem'));
          this.trigger(wikimate.events.CHANGE, action('add', item, this.prev().prop('id')));
        } else {
          renderByPlugin(this);
          this.trigger(wikimate.events.CHANGE, action('edit', item));
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
})(jQuery);
