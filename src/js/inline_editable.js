(function($) {
  $.plugin('wikimate_inline_editable', {
    init: function(options) {
      this.dblclick(function(e) {
        if ($(this).find('.wikimate-inline-editor').length > 0) {
          return false;
        }
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
          }).dblclick(function(e) {
            return false;
          });
        if (options && options.width) {
          editor.width(options.width);
        }
        $(this).empty().html(editor);
        editor.focus();
      });
      return this;
    }
  });
})(jQuery);
