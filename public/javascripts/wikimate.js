wikimate = {
  version: '0.0.1',
  plugins: {},
  wiki: function(id) {
    var storyElement = $(id).addClass('wikimate-story');
    return {
      story: function(elements) {
        $.each(elements, function(i, item) {
          var div = $("<div />").addClass("element").addClass(item.type).attr("id", item.id);
          storyElement.append(div);
          wikimate.applyPlugin(div, item);
        });
      }
    };
  },
  applyPlugin: function(div, item) {
    var plugin = wikimate.plugins[item.type];
    plugin.emit(div, item);
    plugin.bind(div, item);
  },
  textEditor: function(div, item) {
    textarea = $("<textarea>" + item.text + "</textarea>").focusout(function() {
      item.text = textarea.val();
      $(wikimate).trigger('change', {
        id: item.id,
        type: 'edit',
        item: item
      })
      wikimate.applyPlugin(div.empty(), item);
    }).bind('dblclick', function(e) {
      return false;
    });
    div.html(textarea);
    return textarea.focus();
  }
};