jQuery.plugin('wikimate_text_editor', (function($) {
  var KeyCode = {
    TAB:       9,
    RETURN:   13,
    ESC:      27,
    s:        83
  };

  function createSaveDot() {
    return $('<a href="javascript:void(0)">*</a>').prop('title', 'Click me/outside to save, or Ctrl/Cmd + s to save. ESC to cancel').css('color', 'red');
  }

  function syncHeight(textarea) {
    var expectedTextHeight = textarea.prop('scrollHeight');
    if (expectedTextHeight > textarea.innerHeight()) {
      var lineHeight = textarea.css('line-height');
      textarea.height(expectedTextHeight + parseInt(lineHeight, 10));
    }
  }

  function initActionBar($this, textarea) {
    var bar = $('<div />').addClass('editor-action-bar').append(createSaveDot());
    $this.append(bar).hover(function(e) {
      bar.show();
    }, function(e) {
      bar.hide();
    });
    textarea.on('keydown.editor_action_bar', function() {
      textarea.off('.editor_action_bar');
      bar.show();
    });
  }

  return {
    init: function() {
      var item = this.story_item('data');
      var $this = this;
      var textarea = $("<textarea/>").text(item.text).addClass('plain-text-editor').focusout(function() {
        $this.story_item('save', textarea.val());
      }).on('keydown', function(e) {
        if (e.which == KeyCode.ESC) {
          $this.wikimate_text_editor('cancel');
        } else if ((e.metaKey || e.ctrlKey) && e.which == KeyCode.s) { // cmd + s
          e.preventDefault();
          e.stopPropagation();
          // todo should we use $this.wikimate_text_editor('save', textarea.val());?
          textarea.focusout();
        }
      }).on('keyup', function(e) {
        syncHeight(textarea);
        // in keyup so that we can findout the new RETURN is added into last line
        // could not find out a way to do this in keydown
        if (e.which == KeyCode.RETURN) {
          // Is it same on Windows?
          var text = textarea.val();
          if (text.trim().length > 0 && text.substr(-2) == "\n\n") {
            e.preventDefault();
            textarea.val(text.substr(0, text.length - 1));
            textarea.focusout();
            $('<div/>').story_item({data: {type: item.type}, newItem: true}).insertAfter($this).story_item('edit');
          }
        }
      }).on('dblclick', function() {
        return false;
      }).focus();

      this.html(textarea);

      initActionBar(this, textarea);

      syncHeight(textarea);

      return this.wikimate_text_editor('moveCursorTo', item.text.length);
    },

    moveCursorTo: function(pos) {
      var textarea = this.find('> .plain-text-editor')[0];
      textarea.selectionStart = pos;
      textarea.selectionEnd = pos;
      return this;
    },

    cancel: function() {
      return this.story_item('render');
    }
  };
})(jQuery));
