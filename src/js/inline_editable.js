(function($) {
  $.plugin('wikimate_inline_editable', {
    init: function(options) {
      this.dblclick(function(e) {
        var editor = $('<input type="text"/>')
          .addClass('wikimate-inline-editor')
          .val($(this).text())
          .editor_shortcuts({
            value: $(this).text(),
            save: function(before_edit_value) {
              this.parent().text(this.val());
              if (options.saved) {
                options.saved.apply(this, [this.val()]);
              }
            },
            cancel: function(before_edit_value) {
              this.parent().text(before_edit_value);
              if (options.canceled) {
                options.canceled.apply(this, [before_edit_value]);
              }
            }
          });
        $(this).html(editor);
      });
    }
  });
})(jQuery);
