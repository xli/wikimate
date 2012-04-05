(function($) {
  wikimate.plugins.paragraph = {
    // item: { "id": "1", "type": "paragraph", "text": "paragraph 1" }
    emit: function(div, item) {
      var html = $.map(item.text.split("\n"), function(text) {
        return text.length > 0 ? "<p>" + text + "</p>" : '';
      }).join('');
      return div.html(html);
    },
    bind: function(div, item) {
      return div.unbind('dblclick').dblclick(function(e) {
        if (e.target == div[0]) {
          e.stopPropagation();
          return wikimate.plainTextEditor(div, item).focus();
        }
      });
    }
  }
})(jQuery);
