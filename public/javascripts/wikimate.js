(function($) {

  var Events = {
    CHANGE: 'storyChanged'
  };

  var plugins = {
    apply: function(div, item) {
      var plugin = this[item.type];
      plugin.emit(div, item);
      plugin.bind(div, item);
    }
  };

  function action(type, item) {
    return {
      id: item.id,
      type: type,
      item: item
    }
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
      this.panel = element.addClass('wikimate-story').bind('dblclick', function(e) {
        if (e.target == element[0]) {
          e.stopPropagation();
          renderer.show(newItem(), {new: true}).dblclick();
        }
      });
    },

    edit: function(div, item, changes) {
      var editItem = $.extend(item, changes);
      this.update(div, item);
      if (div.data('new')) {
        div.removeData('new');
        this.trigger(action('add', editItem));
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
      var div = $("<div />").addClass("item").addClass(item.type).attr("id", item.id);
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

    trigger: function(action) {
      this.panel.trigger(Events.CHANGE, action);
    }
  };

  window.wikimate = {
    version: '0.0.1',
    plugins: plugins,
    init: function(element, items) {
      renderer.init(element);
      $.each(items, function(i, item) {
        renderer.show(item, {});
      });
    },
    plainTextEditor: function(div, item) {
      return createPlainTextEditor(div, item);
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
          renderer.show(newItem({type: item.type}), {after: item.id, new: true}).dblclick();
        }
      }
    }).bind('dblclick', function(e) {
      return false;
    });

    div.html(textarea);
    syncHeight(textarea);

    return textarea;

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
