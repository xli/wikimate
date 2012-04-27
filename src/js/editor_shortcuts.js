/**
 * Attached simple editor shortcuts convention:
 *  Esc to cancel
 *  Focusout to save
 *  Ctrl/Cmd + s to save
 *  Enter to save, ignored when pass option ignoreReturn = true
 */
(function($) {
  var KeyCode = {
    TAB:       9,
    RETURN:   13,
    ESC:      27,
    s:        83
  };

  $.plugin('editor_shortcuts', {
    /**
     * Options
     *   save: callback function, one argument options.value, applied to editor_shortcuts element jQuery object
     *   cancel: callback function, one argument options.value, applied to editor_shortcuts element jQuery object
     *   value: a value passed to callback functions
     *   ignoreReturn: does not do save when the value is true, default is false
     */
    init: function(options) {
      return this.focusout(function(e) {
        options.save.apply($(this), [options.value]);
      }).keydown(function(e) {
        if (e.which == KeyCode.ESC) {
          e.preventDefault();
          e.stopPropagation();
          options.cancel.apply($(this), [options.value]);
        } else if (e.which == KeyCode.RETURN) {
          if (options.ignoreReturn) {
            return;
          }
          e.preventDefault();
          e.stopPropagation();
          options.save.apply($(this), [options.value]);
        } else if ((e.metaKey || e.ctrlKey) && e.which == KeyCode.s) { // cmd + s
          e.preventDefault();
          e.stopPropagation();
          options.save.apply($(this), [options.value]);
        }
      });
    }
  });
})(jQuery);
