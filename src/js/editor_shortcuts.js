/**
 * Attached simple editor shortcuts convention:
 *  Esc to cancel
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

  var eventName = 'click.story_item_editor';

  function on(callback, $this, args) {
    if (callback) {
      callback.apply($this, args);
    }
  }

  $.plugin('editor_shortcuts', {
    /**
     * Options
     *   save: callback function, one argument options.value, applied to editor_shortcuts element jQuery object
     *   cancel: callback function, one argument options.value, applied to editor_shortcuts element jQuery object
     *   value: a value passed to callback functions
     *   ignoreReturn: does not do save when the value is true, default is false
     *   close: callback functions, one argument 'save'/'cancel', applied to editor_shortcuts element jQuery object
     */
    init: function(options) {
      return this.data('options', options)
        .editor_shortcuts('bindShortcuts')
        .editor_shortcuts('bindClickOutsideSave');
    },

    save: function() {
      var options = this.data('options');
      if (options) {
        $(window).off(eventName);
        on(options.save, this, [options.value]);
        on(options.close, this, ['save']);
      }
    },

    cancel: function() {
      var options = this.data('options');
      if (options) {
        $(window).off(eventName);
        on(options.cancel, this, [options.value]);
        on(options.close, this, ['cancel']);
      }
    },

    editingElement: function() {
      return this.parent()[0];
    },

    bindClickOutsideSave: function() {
      var $this = this;
      $(window).on(eventName, function(e) {
        var editingElement = $this.editor_shortcuts('editingElement');
        var eventTargetExistsInDom = $(e.target).closest('html')[0];
        if (eventTargetExistsInDom && editingElement && !$.contains(editingElement, e.target)) {
          $this.editor_shortcuts('save');
        }
      });
      return this;
    },

    bindShortcuts: function() {
      var options = this.data('options');
      return this.keydown(function(e) {
        if (e.which == KeyCode.ESC) {
          e.preventDefault();
          e.stopPropagation();
          $(this).editor_shortcuts('cancel');
        } else if (e.which == KeyCode.RETURN) {
          if (options.ignoreReturn) {
            return;
          }
          e.preventDefault();
          e.stopPropagation();
          $(this).editor_shortcuts('save');
        } else if ((e.metaKey || e.ctrlKey) && e.which == KeyCode.s) { // cmd + s
          e.preventDefault();
          e.stopPropagation();
          $(this).editor_shortcuts('save');
        }
      });
    }
  });
})(jQuery);
