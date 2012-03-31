(function() {
  window.wikimate = {
    version: '0.0.1',
    plugins: {},
    panel: null,
    wiki: function(id) {
      wikimate.panel = $(id).addClass('wikimate-story').bind('dblclick', function(e) {
        if (e.target == $(id)[0]) {
          e.stopPropagation();
          renderNewItem().dblclick();
        }
      });
      return {
        story: function(elements) {
          $.each(elements, function(i, item) {
            renderItem(item);
          });
        }
      };
    },
    textEditor: function(div, item) {
      var textarea = $("<textarea>" + item.text + "</textarea>").focusout(function() {
        if (textarea.val() != item.text) {
          item.text = textarea.val();
          $(wikimate).trigger('change', {
            id: item.id,
            type: item.newItem ? 'new' : 'edit',
            item: item
          })
        }
        applyPlugin(div.empty(), item);
      }).bind('keypress', function(e) {
        var reg = /\n$/m;
        if (e.which == KeyCode.RETURN && reg.test(textarea.val())) {
          e.preventDefault();
          textarea.focusout();
          renderNewItem({type: item.type, after: item.id}).dblclick();
        }
      });
      div.html(textarea);
      return textarea.focus();
    }
  }

  var KeyCode = {
    RETURN: 10
  };
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

  function renderNewItem(attrs) {
    return renderItem(newItem(attrs))
  };

  function newItem(attrs) {
    var item = {id: generateId(), type: 'paragraph', newItem: true, text: ''};
    if (attrs) {
      jQuery.extend(item, attrs)
    }
    return item
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
})();
