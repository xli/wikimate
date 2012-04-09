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
      // dblclick e.target is div p, should we move dblclick to div p?
      return div.unbind('dblclick').dblclick(function(e) {
        e.stopPropagation();
        return wikimate.plainTextEditor(div, item).focus();
      });
    }
  }
})(jQuery);
