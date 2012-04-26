(function($) {

  function save($this, ed) {
    var text = ed.getContent();
    ed.remove();
    ed.destroy();
    $this.story_item('save', text);
  }

  wikimate.plugins.rdoc = {
    title: 'Rich Document',
    emit: function(div, item) {
      return div.html(item.text);
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
      var $this = this;
      var id = wikimate.utils.generateId();
      var textarea = $('<textarea/>').prop('id', id).text(item.text).appendTo(this.empty());
      tinymce.init({
        mode : "exact",
        elements: id,
        theme : "advanced",
        plugins : "autolink,save",
        theme_advanced_buttons3: 'save',
        theme_advanced_toolbar_location : "top",
        theme_advanced_toolbar_align : "left",
        // theme_advanced_statusbar_location : "bottom",
        auto_focus: id,
        save_onsavecallback: function(ed) {
          save($this, ed);
          return false;
        },
        setup: function(ed) {
          ed.onInit.add(function(ed, evt) {
            tinymce.dom.Event.add(ed.getDoc(), 'focusout', function(e) {
              _.defer(save, $this, ed);
            });
          });
        },
      });
      return this;
    }
  };
})(jQuery);
