(function($) {

  var plugins = {
    apply: function(div, item) {
      var plugin = this[item.type];
      plugin.emit(div, item);
      plugin.bind(div, item);
    }
  };

  var renderer = {
    init: function(element) {
      this.panel = element.addClass('wikimate-story').bind('dblclick', function(e) {
        if (e.target == element[0]) {
          e.stopPropagation();
          renderer.show(newItem()).dblclick();
        }
      });
    },

    show: function(item) {
      var div = $("<div />").addClass("item").addClass(item.type).attr("id", item.id);
      if (item.after) {
        $('#' + item.after).after(div);
      } else {
        this.panel.append(div);
      }
      plugins.apply(div, item);
      return div;
    },

    update: function(div, item) {
      plugins.apply(div.empty(), item);
    },

    delete: function(div) {
      div.remove();
    }
  };

  window.wikimate = {
    version: '0.0.1',
    plugins: plugins,
    init: function(element, items) {
      renderer.init(element);
      $.each(items, function(i, item) {
        renderer.show(item);
      });
    },
    plainTextEditor: function(div, item) {
      return createPlainTextEditor(div, item).focus();
    }
  };

  $.fn.wikimate = function(items) {
    window.wikimate.init(this, items);
    return this;
  }

  var KeyCode = {
    TAB:       9,
    RETURN:   13,
    ESC:      27
  };

  function newItem(attrs) {
    var item = {id: generateId(), type: 'paragraph', newItem: true, text: ''};
    if (attrs) {
      $.extend(item, attrs);
    }
    return item;
  };

  function createPlainTextEditor(div, item) {
    function cancelEdit() {
      renderer.update(div, item);
    };
    function deleteItem() {
      $(wikimate).trigger('change', {
        id: item.id,
        type: 'delete',
        item: item
      });
      renderer.delete(div);
    };
    function updateItem(text) {
      item.text = text;
      $(wikimate).trigger('change', {
        id: item.id,
        type: item.newItem ? 'new' : 'edit',
        item: item
      });
      renderer.update(div, item);
    };
    function save(text) {
      if (text == '') {
        deleteItem();
      } else if (text != item.text) {
        updateItem(text);
      } else {
        cancelEdit();
      }
    };
    var textarea = $("<textarea>" + item.text + "</textarea>").addClass('plain-text-editor').focusout(function() {
      save(textarea.val());
    }).bind('keydown', function(e) {
      if (e.which == KeyCode.RETURN && textarea.val().match(/.+\n$/m)) {
        e.preventDefault();
        textarea.focusout();
        renderer.show(newItem({type: item.type, after: item.id})).dblclick();
      } else if (e.which == KeyCode.ESC) {
        cancelEdit();
      }
    });
    div.html(textarea);
    return textarea;
  }

  function generateId() {
    return randomBytes(8);
  };

  function randomByte() {
    return (((1 + Math.random()) * 0x100) | 0).toString(16).substring(1);
  };

  function randomBytes(n) {
    return ((function() {
      var _i, _results;
      _results = [];
      for (_i = 1; 1 <= n ? _i <= n : _i >= n; 1 <= n ? _i++ : _i--) {
        _results.push(randomByte());
      }
      return _results;
    })()).join('');
  };

})(jQuery);
