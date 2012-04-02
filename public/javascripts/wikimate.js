(function($) {

  window.wikimate = {
    version: '0.0.1',
    plugins: {},
    panel: null,
    init: function(element, items) {
      this.panel = element.addClass('wikimate-story').bind('dblclick', function(e) {
        if (e.target == element[0]) {
          e.stopPropagation();
          renderNewItem().dblclick();
        }
      });
      $.each(items, function(i, item) {
        renderItem(item);
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

  function renderNewItem(attrs) {
    return renderItem(newItem(attrs))
  };

  function renderItem(item) {
    var div = $("<div />").addClass("item").addClass(item.type).attr("id", item.id);
    if (item.after) {
      $('#' + item.after).after(div);
    } else {
      wikimate.panel.append(div);
    }
    applyPlugin(div, item);
    return div;
  };

  function newItem(attrs) {
    var item = {id: generateId(), type: 'paragraph', newItem: true, text: ''};
    if (attrs) {
      $.extend(item, attrs)
    }
    return item
  };

  function createPlainTextEditor(div, item) {
    function cancelEdit() {
      applyPlugin(div.empty(), item);
    };
    function deleteItem() {
      $(wikimate).trigger('change', {
        id: item.id,
        type: 'delete',
        item: item
      });
      div.remove();
    }
    function updateItem(text) {
      item.text = text;
      $(wikimate).trigger('change', {
        id: item.id,
        type: item.newItem ? 'new' : 'edit',
        item: item
      });
      applyPlugin(div.empty(), item);
    }
    function save(textarea) {
      if (textarea.val() == '') {
        deleteItem();
      } else if (textarea.val() != item.text) {
        updateItem(textarea.val());
      } else {
        cancelEdit();
      }
    }
    var textarea = $("<textarea>" + item.text + "</textarea>").addClass('plain-text-editor').focusout(function() {
      save(textarea);
    }).bind('keydown', function(e) {
      if (e.which == KeyCode.RETURN && textarea.val().match(/.+\n$/m)) {
        e.preventDefault();
        textarea.focusout();
        renderNewItem({type: item.type, after: item.id}).dblclick();
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

  function applyPlugin(div, item) {
    var plugin = wikimate.plugins[item.type];
    plugin.emit(div, item);
    plugin.bind(div, item);
  };

})(jQuery);
