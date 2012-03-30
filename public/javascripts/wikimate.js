KeyCode = {
  RETURN: 10
};
wikimate = {
  version: '0.0.1',
  plugins: {},
  wiki: function(id) {
    wikimate.panel = $(id).addClass('wikimate-story');
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
  renderItem: function(item) {
    var div = $("<div />").addClass("item").addClass(item.type).attr("id", item.id);
    wikimate.panel.append(div);
    wikimate.applyPlugin(div, item);
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
        var newItem = {id: wikimate.generateId(), type: item.type, newItem: true, text: ''};
        wikimate.renderItem(newItem);
        $("#" + newItem.id).dblclick();
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
