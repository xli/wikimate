(function($) {
  function markdown(text) {
    return new Showdown.converter().makeHtml(text);
  }

  wikimate.plugins.markdown = {
    // item: { "id": "1", "type": "markdown", "text": "markdown text" }
    title: "Markdown",
    emit: function(div, item) {
      return div.html(markdown(item.text));
    },
    bind: function(div, item) {
      var $this = this;
      div.on('dblclick', function(e) {
        if ($this.story_item('editable')) {
          $this.story_item('edit');
        }
      });
    },
    edit: function(div, item) {
      return this.wikimate_text_editor('init');
    }
  };
})(jQuery);
