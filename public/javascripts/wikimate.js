(function($) {

  var Events = {
    CHANGE: 'wikimate:change',
    NEW: 'wikimate:new',
    EDIT: 'wikimate:edit'
  };
  var Journal = (function() {
    var journal = {
      push: function(action) {
        this.append($('<a href="#"/>').data('data', action).addClass('action ' + action.type).text(action.type.charAt(0)).hover(function(e) {
          $('#' + action.id).addClass('highlight');
        }, function(e) {
          $('#' + action.id).removeClass('highlight');
        }));
      }
    }
    return {
      create: function() {
        return $('<div />').addClass('wikimate-journal').extend(journal);
      }
    }
  })();

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
    // todo need clean
    init: function(element, wiki) {
      this.frame = element.addClass('wikimate');
      this.panel = $('<div />').addClass('wikimate-panel').bind(Events.NEW, function(e) {
        renderer.show(newItem(), {new: true}).trigger(Events.EDIT);
      }).bind('dblclick', function(e) {
        e.preventDefault();
        e.stopPropagation();
        if (e.target == $(this)[0]) {
          $(this).trigger(Events.NEW);
        }
      }).bind(Events.EDIT, this.editHandler).sortable({
        handle: '.item-handle',
        update: function(event, ui){ renderer.moved(ui.item); }
      });
      this.journal = Journal.create();
      this.frame.append(this.panel);
      this.frame.append(this.journal);

      $.each(wiki.story, function(i, item) {
        renderer.show(item, {});
      });
      $.each(wiki.journal, function(i, action) {
        renderer.journal.push(action);
      });
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
      this.journal.push(action);
      this.panel.trigger(Events.CHANGE, action);
    }
  };

  window.wikimate = {
    version: '0.0.1',
    plugins: plugins,
    events: Events,
    init: function(element, wiki) {
      renderer.init(element, wiki);
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
      this.bind(Events.CHANGE, wiki.change);
    }
    return this;
  }

  var KeyCode = {
    TAB:       9,
    RETURN:   13,
    ESC:      27,
    s:        83
  };

  function createPlainTextEditor(div, item) {
    var textarea = $("<textarea/>").text(item.text).addClass('plain-text-editor').focusout(function() {
      save(textarea.val());
    }).bind('keydown', function(e) {
      if (e.which == KeyCode.RETURN) {
        syncHeight(textarea);
      } else if (e.which == KeyCode.ESC) {
        cancelEdit();
      } else if ((e.metaKey || e.ctrlKey) && e.which == KeyCode.s) { // cmd + s
        e.preventDefault();
        e.stopPropagation();
        textarea.focusout();
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

    var bar = ItemActionBar.appendTo(div).append($('<a href="#">*</a>').attr('title', 'Click me/outside to save. ESC to cancel').css('color', 'red'));
    textarea.bind('keydown.item_action_bar', function() {
      textarea.unbind('.item_action_bar');
      bar.show();
    });

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
