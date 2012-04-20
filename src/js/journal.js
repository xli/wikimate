(function($) {

  $.plugin('journal', (function() {

    function createAction(action) {
      var identifier = action.type.charAt(0);
      return $('<a href="javascript:void(0)"/>').data('data', action)
        .addClass('action ' + action.type)
        .text(identifier)
        .hover(function(e) {
          $('#' + action.id).addClass('highlight');
        }, function(e) {
          $('#' + action.id).removeClass('highlight');
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
