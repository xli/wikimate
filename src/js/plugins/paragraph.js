(function($) {
  // todo change to be wikimate.story.plugins?
  wikimate.plugins.paragraph = {
    // item: { "id": "1", "type": "paragraph", "text": "paragraph 1" }
    title: 'Wiki Paragraph',
    emit: function(div, item) {
      var html = $.map(item.text.split("\n"), function(text) {
        return text.length > 0 ? "<p>" + text + "</p>" : '';
      }).join('');
      return div.html(html);
    },
    bind: function(div, item) {
      var $this = this;
      div.on('dblclick', function(e) {
        if ($this.story_item('editable')) {
          $this.story_item('edit');
        }
      });
    },
    edit: function(item) {
      return this.wikimate_text_editor('init');
    }
  };
})(jQuery);
