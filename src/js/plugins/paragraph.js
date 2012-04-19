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
      div.on('click', function(e) {
        e.stopPropagation();
        e.preventDefault();
        div.trigger(wikimate.events.EDIT);
      });
    }
  };
})(jQuery);
