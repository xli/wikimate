(function($) {

  var Events = {
    CHANGE: 'wikimate:change',
    NEW: 'wikimate:new',
    EDIT: 'wikimate:edit'
  };

  $.plugin = function(name, methods) {
    $.fn[name] = function(method) {
      // Method calling logic
      if (methods[method]) {
        return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
      } else if (typeof method === 'object' || !method) {
        return methods.init.apply(this, arguments);
      } else {
        $.error('Method ' +  method + ' does not exist on jQuery.' + name);
      };
    };
  }

  $.plugin('journal', {
    init: function(actions) {
      return this.addClass('wikimate-journal').journal('pushAll', actions);
    },
    push: function(action) {
      return this.append($('<a href="#"/>').data('data', action).addClass('action ' + action.type).text(action.type.charAt(0)).hover(function(e) {
        $('#' + action.id).addClass('highlight');
      }, function(e) {
        $('#' + action.id).removeClass('highlight');
      }));
    },
    pushAll: function(actions) {
      var $this = this;
      $.each(actions, function(i, action) {
        $this.journal('push', action);
      });
      return this;
    }
  });

  (function() {
    function action(type, item, after) {
      return {
        id: item.id,
        type: type,
        item: item,
        after: after
      };
    };

    $.plugin('story_item', {
      init: function(options) {
        var item = this.story_item('data', options.data || {}).story_item('data');
        return this.addClass("item " + item.type).attr("id", item.id).data('new', options.new).story_item('render');
      },

      data: function(attrs) {
        if (attrs) {
          var item = {id: utils.generateId(), type: 'paragraph', text: ''};
          if (attrs) {
            $.extend(item, attrs);
          }
          return this.data('data', item);
        } else {
          return this.data('data');
        }
      },

      render: function() {
        var item = this.story_item('data');
        var plugin = plugins[item.type];
        // add another div inside for removing conflict highlighting with text area
        // after changed to edit mode
        var content = $('<div />').addClass('item-content');
        plugin.emit(content, item);
        plugin.bind(content, item);
        Handle.appendTo(content)
        return this.html(content).click(function(e) {
          return content.click();
        }).dblclick(function(e) {
          return content.dblclick();
        });
      },

      remove: function() {
        if (this.data('new')) {
          this.remove();
        } else {
          this.story_item('changed', action('remove', this.story_item('data'))).remove();
        }
      },

      save: function(changes) {
        var item = $.extend(this.story_item('data'), changes);
        if (this.data('new')) {
          this.removeData('new').story_item('data', $.extend(item, changes)).story_item('render').story_item('changed', action('add', item, this.prev().attr('id')));
        } else {
          this.story_item('render');
          this.story_item('changed', action('edit', $.extend(item, changes)));
        }
        return this;
      },

      changed: function(action) {
        wikimate.journal.journal('push', action);
        return this.trigger(Events.CHANGE, action);
      }
    });
  })();

  $.plugin('story', {
    init: function(items) {
      var $this = this;
      $.each(items, function(i, item) {
        $('<div/>').story_item({data: item}).appendTo($this);
      });
      return this.addClass('wikimate-story').story('bindChangeEvents').story('dblclickToNewItem');
    },

    bindChangeEvents: function() {
      var $this = this;
      return this.on(Events.NEW, function(e) {
        $('<div/>').story_item({new: true}).appendTo($this).trigger(Events.EDIT);
      }).on(Events.EDIT, function(e) {
        // e.target should be item-content or item
        // todo, something wrong here
        var div = $(e.target).story_item('data') ? $(e.target) : $(e.target).parent();
        createPlainTextEditor(div);
      }).sortable({
        handle: '.item-handle',
        update: function(event, ui){
          ui.item.story_item('changed', {
            id: ui.item.id,
            type: 'move',
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
          $this.trigger(Events.NEW);
        }
      });
    }
  });

  var ItemActionBar = (function() {
    return {
      appendTo: function(div) {
        var bar = $('<div />').addClass('item-action-bar');
        // delegate event?
        div.append(bar).hover(function(e) {
          bar.show();
        }, function(e) {
          bar.hide();
        }).click(function(e) {
          return false;
        });
        return bar;
      }
    }
  })();

  var Handle = (function() {
    var cursor = {
      grab: function() {
        return this.css('cursor', 'grab').css('cursor', '-moz-grab').css('cursor', '-webkit-grab');
      },
      grabing: function() {
        return this.css('cursor', 'grabbing').css('cursor', '-moz-grabbing').css('cursor', '-webkit-grabbing');
      }
    }
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
    }
  })();

  var plugins = {
  };

  window.wikimate = {
    version: '0.0.1',
    plugins: plugins,
    events: Events,
    init: function(element, wiki) {
      this.story = $('<div />').story(wiki.story);
      this.journal = $('<div />').journal(wiki.journal);
      return element.addClass('wikimate').append(this.story).append(this.journal);
    }
  };

  $.fn.wikimate = function(options) {
    var wiki = $.extend({
      story: [],
      journal: [],
      change: null
    }, options);
    window.wikimate.init(this, wiki);
    if (wiki.change) {
      this.on(Events.CHANGE, '.item', wiki.change);
    }
    return this;
  }

  var KeyCode = {
    TAB:       9,
    RETURN:   13,
    ESC:      27,
    s:        83
  };

  function createPlainTextEditor(div) {
    var item = div.story_item('data');
    var textarea = $("<textarea/>").text(item.text).addClass('plain-text-editor').focusout(function() {
      var text = textarea.val()
      if (text == '') {
        div.story_item('remove');
      } else if (text != item.text) {
        div.story_item('save', {text: text});
      } else {
        cancelEdit();
      }
    }).on('keydown', function(e) {
      if (e.which == KeyCode.ESC) {
        cancelEdit();
      } else if ((e.metaKey || e.ctrlKey) && e.which == KeyCode.s) { // cmd + s
        e.preventDefault();
        e.stopPropagation();
        textarea.focusout();
      }
    }).on('keyup', function(e) {
      syncHeight(textarea);
      // in keyup so that we can findout the new RETURN is added into last line
      // could not find out a way to do this in keydown
      if (e.which == KeyCode.RETURN) {
        // Is it same on Windows?
        var text = textarea.val();
        if (text.trim().length > 0 && text.substr(-2) == "\n\n") {
          e.preventDefault();
          textarea.val(text.substr(0, text.length - 1));
          textarea.focusout();
          $('<div/>').story_item({data: {type: item.type}, new: true}).insertAfter(div).trigger(Events.EDIT);
        }
      }
    }).on('dblclick', function() {
      return false;
    }).focus();

    div.html(textarea);

    var bar = ItemActionBar.appendTo(div).append(saveDot());
    textarea.on('keydown.item_action_bar', function() {
      textarea.off('.item_action_bar');
      bar.show();
    });

    syncHeight(textarea);
    setCursor(item.text.length);

    return textarea;

    function saveDot() {
      return $('<a href="#">*</a>').attr('title', 'Click me/outside to save, or Ctrl/Cmd + s to save. ESC to cancel').css('color', 'red');
    }

    function setCursor(pos) {
      textarea[0].selectionStart = pos;
      textarea[0].selectionEnd = pos;
    }

    function syncHeight(textarea) {
      var expectedTextHeight = textarea.prop('scrollHeight');
      if (expectedTextHeight > textarea.innerHeight()) {
        textarea.height(expectedTextHeight);
      }
    };

    function cancelEdit() {
      div.story_item('render');
    };
  }

  var utils = (function() {
    function randomBytes(n) {
      var results = [];
      for (var i = 1; 1 <= n ? i <= n : i >= n; 1 <= n ? i++ : i--) {
        results.push(randomByte());
      }
      return results.join('');
    };
    function randomByte() {
      return (((1 + Math.random()) * 0x100) | 0).toString(16).substring(1);
    };

    return {
      generateId: function() {
        return randomBytes(8);
      }
    }
  })();

})(jQuery);
