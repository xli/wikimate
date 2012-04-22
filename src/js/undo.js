(function($) {
  var revert = (function() {
    var revert_action_type_map = {'remove': 'add', 'add': 'remove', 'edit': 'edit'};
    var map = {
      remove: function(action) {
        var story = wikimate.utils.replay(this.wikimate('journal'));
        var item = story.itemById(action.id);
        var index = story.indexOf(item);
        var after = index == 0 ? null : story[index - 1].id;
        return {id: action.id, type: 'add', item: item, after: after};
      },
      add: function(action) {
        return {id: action.id, type: 'remove', item: action.item, after: action.after};
      },
      edit: function(action) {
        var story = wikimate.utils.replay(this.wikimate('journal'))
        var prev = story.itemById(action.id);
        return {id: action.id, type: 'edit', item: $.extend({}, prev)};
      },
      move: function(action) {
        var story = wikimate.utils.replay(this.wikimate('journal'));
        return {id: action.id, type: 'move', order: _.pluck(story, 'id')};
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
