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
          var container = story.itemStoryByItemId(action.inside);
          var item = _.find(container, function(item) { return item.id === action.id; });
          var beforeChange = item ? item.text : undefined;
          var afterChange = action.item ? action.item.text : undefined;
          return JsDiff.convertChangesToXML(JsDiff.diffWords(beforeChange, afterChange)).replace(/\n/g, "<br/>");
        default:
          throw "Unknown action type " + action.type;
      }
    }

    function createAction(journal, action) {
      var identifier = action.type.charAt(0);
      return $('<a href="javascript:void(0)"/>').data('data', action)
        .addClass('action ' + action.type)
        .text(identifier)
        .hover(function(e) {
          $('#' + action.id).addClass('highlight');
          var tooltip = actionTooltip(journal, action);
          var rootOffset = journal.parent().offset();
          var offset = $(this).offset();
          offset.left -= rootOffset.left;
          offset.top -= rootOffset.top;
          var element = $('<div/>').addClass('diff')
            .html(tooltip)
            .appendTo(journal.parent())
            .css('left', offset.left + $(this).width() * 3 / 4);
          element.css('top', offset.top - element.height());
        }, function(e) {
          $('.wikimate .diff').remove();
          $('.wikimate .highlight').removeClass('highlight');
        });
    }
    var afterActionCreated;
    return {
      init: function(actions, after_action_created) {
        var $this = this;
        afterActionCreated = after_action_created;
        $.each(actions || [], function(i, action) {
          $this.journal('push', action);
        });
        return this;
      },
      push: function(action) {
        var actionElement = createAction(this, action);
        this.append(actionElement);
        if (afterActionCreated) {
          afterActionCreated(actionElement);
        }
        return this;
      },
      pop: function() {
        var lastAction = this.find('> .action:last');
        var data = lastAction.data('data');
        lastAction.remove();
        return data;
      },
      data: function() {
        return $.map(this.find('> .action'), function(element) {
          return $(element).data('data');
        });
      }
    };
  })());

  wikimate.fn.journal = function(journal, afterActionCreated) {
    if (journal) {
      var element = $('<div />').addClass('wikimate-journal').journal('init', journal, afterActionCreated);
      // handler is processed before handlers on wikimate element
      this.find('> .wikimate-story').on(wikimate.events.CHANGE, function(e, action) {
        element.journal('push', action);
      });
      return this.append(element);
    } else {
      return this.find('> .wikimate-journal').journal('data');
    }
  };
})(jQuery);
