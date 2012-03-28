wikimate.plugins.paragraph = {
  emit: function(div, item) {
    return div.append("<p>" + item.text + "</p>");
  },
  bind: function(div, item) {
    return div.dblclick(function() {
      return wikimate.textEditor(div, item);
    });
  }
}
