(function($) {
  var revert = (function() {
    var revert_action_type_map = {'remove': 'add', 'add': 'remove', 'edit': 'edit'};
    var map = {
      remove: function(action) {
        return {id: action.id, type: 'add', item: action.item, after: action.after};
      },
      add: function(action) {
        return {id: action.id, type: 'remove', item: action.item, after: action.after};
      },
      edit: function(action) {
        var prev = _.find(this.wikimate('journal').reverse(), function(ja) {
          return ja.id == action.id && ja.type != "move";
        });
        // todo: what if we could not find prev because of data issue?
        return {id: action.id, type: 'edit', item: $.extend({}, prev.item)};
      },
      move: function(action) {
        return {id: action.id, type: 'move', order: action.prevOrder};
      }
    };
    return function(action) {
      return map[action.type].apply(this, [action]);
    };
  })();

  wikimate.fn.undo = function() {
    var action = this.find('.wikimate-journal').journal('pop');
    if (!action) {
      return;
    }
    this.find('.wikimate-story').story('execute', revert.apply(this, [action]));
    return action;
  };
})(jQuery);
