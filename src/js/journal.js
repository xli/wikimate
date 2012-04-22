(function($) {

  $.plugin('journal', (function() {

    function actionTooltip(journal, action) {
      switch(action.type) {
        case "move":
          return "Item was moved";
        case "add":
        case "remove":
        case "edit":
          var events = journal.journal('data');
          var story = wikimate.utils.replay(events.slice(0, events.indexOf(action)));
          var item = story.itemById(action.id);
          var beforeChange = item ? item.text : undefined;
          var afterChange = action.item ? action.item.text : undefined;
          return JsDiff.convertChangesToXML(JsDiff.diffWords(beforeChange, afterChange));
        default:
          throw "Unknown action type " + action.type;
      }
    }

    function createAction(action) {
      var identifier = action.type.charAt(0);
      return $('<a href="javascript:void(0)"/>').data('data', action)
        .addClass('action ' + action.type)
        .text(identifier)
        .hover(function(e) {
          $('#' + action.id).addClass('highlight');
          var tooltip = actionTooltip($(this).parent(), action);
          var offset = $(this).offset();
          var element = $('<div/>').addClass('diff')
            .html(tooltip)
            .appendTo($('.wikimate'))
            .css('left', offset.left + $(this).width() * 3 / 4);
          element.css('top', offset.top - element.height());
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
