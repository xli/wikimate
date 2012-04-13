(function($) {

  var Events = {
    CHANGE: 'wikimate:change',
    NEW: 'wikimate:new',
    EDIT: 'wikimate:edit'
  };

  var ItemActionBar = {
    appendTo: function(div) {
      var bar = ItemActionBar.create(div);
      // delegate event?
      div.append(bar).hover(function(e) {
        bar.show();
      }, function(e) {
        bar.hide();
      }).click(function(e) {
        return false;
      });
      return bar;
    },
    create: function(div) {
      return $('<div />').addClass('item-action-bar');
    }
  }

  var Handle = {
    appendTo: function(div) {
      var handle = Handle.create();
      // delegate event?
      div.append(handle).hover(function(e) {
        handle.show();
      }, function(e) {
        handle.hide();
      }).click(function(e) {
        return false;
      });
    },
    create: function() {
      return Handle.grab($('<div />')).addClass('item-handle').mousedown(function(e) {
        Handle.grabing($(this));
      }).mouseup(function() {
        Handle.grab($(this));
      });
    },
    grab: function(handle) {
      return handle.css('cursor', 'grab').css('cursor', '-moz-grab').css('cursor', '-webkit-grab');
    },
    grabing: function(handle) {
      return handle.css('cursor', 'grabbing').css('cursor', '-moz-grabbing').css('cursor', '-webkit-grabbing');
    }
  }

  var plugins = {
    apply: function(div, item) {
      var plugin = this[item.type];
      // add another div inside for removing conflict highlighting with text area
      // after changed to edit mode
      var content = $('<div />').addClass('item-content');
      div.html(content).click(function(e) {
        return content.click();
      }).dblclick(function(e) {
        return content.dblclick();
      });
      plugin.emit(content, item);
      plugin.bind(content, item);
      Handle.appendTo(content)

      var deleteLink = $('<a href="#"></a>').text('delete').click(function(e) {
        e.stopPropagation();
        e.preventDefault();
        renderer.remove(div, item);
      });
      ItemActionBar.appendTo(content).append(deleteLink);
    }
  };

  function action(type, item, after) {
    return {
      id: item.id,
      type: type,
      item: item,
      after: after
    };
  };
  function newItem(attrs) {
    var item = {id: utils.generateId(), type: 'paragraph', text: ''};
    if (attrs) {
      $.extend(item, attrs);
    }
    return item;
  };

  var renderer = {
    init: function(element) {
      this.panel = element.addClass('wikimate').bind(Events.NEW, function(e) {
        renderer.show(newItem(), {new: true}).trigger(Events.EDIT);
      }).bind('dblclick', function(e) {
        e.preventDefault();
        e.stopPropagation();
        if (e.target == $(this)[0]) {
          $(this).trigger(Events.NEW);
        }
      }).bind(Events.EDIT, this.editHandler).sortable({handle: '.item-handle', update: function(event, ui){
        renderer.moved(ui.item);
      }});
    },

    editHandler: function(e) {
      // e.target should be item-content or item
      var div = $(e.target).data('item') ? $(e.target) : $(e.target).parent();
      createPlainTextEditor(div, div.data('item'));
    },

    edit: function(div, item, changes) {
      var editItem = $.extend(item, changes);
      this.update(div, item);
      if (div.data('new')) {
        div.removeData('new');
        var prevItem = div.prev().data('item');
        var after = prevItem ? prevItem.id : undefined;
        this.trigger(action('add', editItem, after));
      } else {
        this.trigger(action('edit', editItem));
      }
      return div;
    },

    remove: function(div, item) {
      if (div.data('new')) {
        div.remove();
      } else {
        div.remove();
        this.trigger(action('remove', item));
      }
      return div;
    },

    show: function(item, options) {
      var div = $("<div />").addClass("item").addClass(item.type).attr("id", item.id).data('item', item);
      if (options['after']) {
        $('#' + options['after']).after(div);
      } else {
        this.panel.append(div);
      }
      if (options['new']) {
        div.data('new', true);
      }
      plugins.apply(div, item);
      return div;
    },

    update: function(div, item) {
      plugins.apply(div.empty(), item);
    },

    moved: function(div) {
      var order = div.parent().children().map(function(_, item) {
        return $(item).data('item').id;
      }).toArray();
      this.trigger({
        id: div.data('item').id,
        type: 'move',
        order: order
      })
    },

    trigger: function(action) {
      this.panel.trigger(Events.CHANGE, action);
    }
  };

  window.wikimate = {
    version: '0.0.1',
    plugins: plugins,
    events: Events,
    init: function(element, items) {
      renderer.init(element);
      $.each(items, function(i, item) {
        renderer.show(item, {});
      });
    }
  };

  $.fn.wikimate = function(options) {
    var settings = $.extend({
      story: [],
      change: null
    }, options);
    window.wikimate.init(this, settings.story);
    if (settings.change) {
      this.bind(Events.CHANGE, settings.change);
    }
    return this;
  }

  var KeyCode = {
    TAB:       9,
    RETURN:   13,
    ESC:      27
  };

  function createPlainTextEditor(div, item) {
    var textarea = $("<textarea/>").text(item.text).addClass('plain-text-editor').focusout(function() {
      save(textarea.val());
    }).bind('keydown', function(e) {
      if (e.which == KeyCode.RETURN) {
        syncHeight(textarea);
      } else if (e.which == KeyCode.ESC) {
        cancelEdit();
      }
    }).bind('keyup', function(e) {
      // in keyup so that we can findout the new RETURN is added into last line
      // I didn't find out a way to do this in keydown
      if (e.which == KeyCode.RETURN) {
        // Is it same on Windows?
        var text = textarea.val();
        if (text.trim().length > 0 && text.substr(-2) == "\n\n") {
          e.preventDefault();
          textarea.val(text.substr(0, text.length - 1));
          textarea.focusout();
          renderer.show(newItem({type: item.type}), {after: item.id, new: true}).trigger(Events.EDIT);
        }
      }
    }).bind('dblclick', function() {
      return false;
    }).focus();

    div.html(textarea);
    syncHeight(textarea);
    setCursor(item.text.length);

    return textarea;

    function setCursor(pos) {
      textarea[0].selectionStart = pos;
      textarea[0].selectionEnd = pos;
    }

    function syncHeight(textarea) {
      var expectedHeight = expectedTextHeight(textarea);
      if (expectedHeight > textarea.height()) {
        textarea.height(expectedHeight);
      }
    };

    function expectedTextHeight(textarea) {
      var lines = textarea.val().split("\n");
      return (lines.length + 1) * lineHeight(textarea);
    };

    function lineHeight(textarea) {
      var lh = parseInt(textarea.css('line-height').replace('px', ''), 10);
      if (isNaN(lh)) {
        throw "Can't get line height! css line-height value is: " + textarea.css('line-height');
      }
      return lh;
    };

    function cancelEdit() {
      renderer.update(div, item);
    };
    function save(text) {
      if (text == '') {
        renderer.remove(div, item);
      } else if (text != item.text) {
        renderer.edit(div, item, {text: text});
      } else {
        cancelEdit();
      }
    };
  }

  var utils = {
    generateId: function() {
      return this.randomBytes(8);
    },

    randomBytes: function(n) {
      var results = [];
      for (var i = 1; 1 <= n ? i <= n : i >= n; 1 <= n ? i++ : i--) {
        results.push(this.randomByte());
      }
      return results.join('');
    },

    randomByte: function() {
      return (((1 + Math.random()) * 0x100) | 0).toString(16).substring(1);
    }
  };

})(jQuery);
