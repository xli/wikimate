(function($) {

  $.plugin('journal', (function() {

    function createAction(action) {
      var identifier = action.type.charAt(0);
      return $('<a href="javascript:void(0)"/>').data('data', action)
        .addClass('action ' + action.type)
        .text(identifier)
        .hover(function(e) {
          var tip;
          var current = $('#' + action.id).story_item('data');
          if (current) {
            var itemEle = $('#' + action.id).addClass('highlight');
            if (action.type == 'move') {
              tip = "Item was moved to here";
            } else {
              var text = current.text;
              var oldText = action.item ? action.item.text : '';
              diff = JsDiff.diffWords(text, oldText);
              if (diff != []) {
                tip = JsDiff.convertChangesToXML(diff);
              } else {
                tip = "No difference found.";
              }
            }
            $('<div/>').addClass('diff').html(tip).appendTo(itemEle);
          } else {
            if (action.type == 'move') {
              tip = "Item was moved and later got removed.";
            } else {
              tip = $('<del/>').html(action.item.text);
            }
            var offset = $(this).offset();
            var left = offset.left + $(this).width() * 3 / 4;
            var top = offset.top - $(this).height() * 3 / 4;
            $('<div/>').css('left', left).css('top', top).addClass('diff').html(tip).appendTo($('.wikimate'));
          }
        }, function(e) {
          $('.wikimate .diff').remove();
          $('.wikimate .highlight').removeClass('highlight');
        });
    }

    return {
      init: function(actions) {
        var $this = this;
        $.each(actions || [], function(i, action) {
          $this.journal('push', action);
        });
        return this;
      },
      push: function(action) {
        return this.append(createAction(action));
      },
      pop: function() {
        var lastAction = this.find('.action:last');
        var data = lastAction.data('data');
        lastAction.remove();
        return data;
      },
      data: function() {
        return $.map(this.find('.action'), function(element) {
          return $(element).data('data');
        });
      }
    };
  })());

  wikimate.fn.journal = function(journal) {
    if (journal) {
      var element = $('<div />').addClass('wikimate-journal').journal('init', journal);
      // handler is processed before handlers on wikimate element
      this.find('.wikimate-story').on(wikimate.events.CHANGE, function(e, action) {
        element.journal('push', action);
      });
      return this.append(element);
    } else {
      return this.find('.wikimate-journal').journal('data');
    }
  };
})(jQuery);
