KeyCode = {
  RETURN: 10
};
wikimate = {
  version: '0.0.1',
  plugins: {},
  wiki: function(id) {
    wikimate.panel = $(id).addClass('wikimate-story').bind('dblclick', function(e) {
      if (e.target == $(id)[0]) {
        e.stopPropagation();
        wikimate.renderNewItem().dblclick();
      }
    });
    return {
      story: function(elements) {
        $.each(elements, function(i, item) {
          wikimate.renderItem(item);
        });
      }
    };
  },

  applyPlugin: function(div, item) {
    var plugin = wikimate.plugins[item.type];
    plugin.emit(div, item);
    plugin.bind(div, item);
  },

  renderNewItem: function(attrs) {
    return wikimate.renderItem(wikimate.newItem(attrs))
  },

  newItem: function(attrs) {
    var item = {id: wikimate.generateId(), type: 'paragraph', newItem: true, text: ''};
    if (attrs) {
      jQuery.extend(item, attrs)
    }
    return item
  },

  renderItem: function(item) {
    var div = $("<div />").addClass("item").addClass(item.type).attr("id", item.id);
    if (item.after) {
      $('#' + item.after).after(div);
    } else {
      wikimate.panel.append(div);
    }
    wikimate.applyPlugin(div, item);
    return div;
  },

  textEditor: function(div, item) {
    var textarea = $("<textarea>" + item.text + "</textarea>").focusout(function() {
      if (textarea.val() != item.text) {
        item.text = textarea.val();
        $(wikimate).trigger('change', {
          id: item.id,
          type: 'edit',
          item: item
        })
      }
      wikimate.applyPlugin(div.empty(), item);
    }).bind('dblclick', function(e) {
      return false;
    }).bind('keypress', function(e) {
      var reg = /\n$/m;
      if (e.which == KeyCode.RETURN && reg.test(textarea.val())) {
        e.preventDefault();
        textarea.focusout();
        wikimate.renderNewItem({type: item.type, after: item.id}).dblclick();
      }
    });
    div.html(textarea);
    return textarea.focus();
  },
  generateId: function() {
    return wikimate.randomBytes(8);
  },
  randomByte: function() {
    return (((1 + Math.random()) * 0x100) | 0).toString(16).substring(1);
  },
  randomBytes: function(n) {
    return ((function() {
      var _i, _results;
      _results = [];
      for (_i = 1; 1 <= n ? _i <= n : _i >= n; 1 <= n ? _i++ : _i--) {
        _results.push(wikimate.randomByte());
      }
      return _results;
    })()).join('');
  }
};
