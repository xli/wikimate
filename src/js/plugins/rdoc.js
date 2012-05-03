(function($) {

  function save($this, ed) {
    var text = ed.getContent();
    ed.remove();
    ed.destroy();
    $this.story_item('save', text);
  }
  function cancel($this, ed) {
    ed.remove();
    ed.destroy();
    $this.story_item('cancel');
  }

  wikimate.plugins.rdoc = {
    title: 'Rich Document',
    editor_options: {},
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
      tinymce.init(_.extend({
        mode : "exact",
        elements: id,
        theme : "advanced",
        plugins : "advlink,advimage,advlist,autoresize,autolink,save,table,fullscreen,spellchecker,wordcount,contextmenu,media,lists,inlinepopups",
        theme_advanced_buttons1 : "save,cancel,|,bold,italic,underline,strikethrough,hr,|,justifyleft,justifycenter,justifyright,justifyfull,|,bullist,numlist,|,outdent,indent,|,undo,redo,|,link,unlink,image,code,removeformat",
        theme_advanced_buttons2 : "table,fullscreen,media,formatselect",
        theme_advanced_buttons3 : "",
        theme_advanced_toolbar_location : "top",
        theme_advanced_toolbar_align : "left",
        // theme_advanced_statusbar_location : "bottom",
        auto_focus: id,
        save_onsavecallback: function(ed) {
          save($this, ed);
          return false;
        },
        save_oncancelcallback: function(ed) {
          cancel($this, ed);
          return false;
        },
        setup: function(ed) {
          // focusout maybe trigger by selecting a list or popups in editor
          // ed.onInit.add(function(ed, evt) {
          //   tinymce.dom.Event.add(ed.getDoc(), 'focusout', function(e) {
          //     _.defer(save, $this, ed);
          //   });
          // });
        }
      }, wikimate.plugins.rdoc.editor_options));
      return this;
    }
  };
})(jQuery);
