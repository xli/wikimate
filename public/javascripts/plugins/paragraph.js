wikimate.plugins.paragraph = {
  // item: { "id": "1", "type": "paragraph", "text": "paragraph 1" }
  emit: function(div, item) {
    return div.append("<p>" + item.text + "</p>");
  },
  bind: function(div, item) {
    return div.dblclick(function(e) {
      e.stopPropagation();
      return wikimate.textEditor(div, item);
    });
  }
}
