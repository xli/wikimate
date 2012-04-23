(function($) {
  function revert(action) {
    var story;
    switch(action.type) {
      case 'remove':
        story = wikimate.utils.replay(this.wikimate('journal'));
        var item = story.itemById(action.id);
        var index = story.indexOf(item);
        var after = index === 0 ? null : story[index - 1].id;
        return {id: action.id, type: 'add', item: item, after: after};
      case 'add':
        return {id: action.id, type: 'remove', item: action.item};
      case 'edit':
        story = wikimate.utils.replay(this.wikimate('journal'));
        var prev = story.itemById(action.id);
        return {id: action.id, type: 'edit', item: $.extend({}, prev)};
      case 'move':
        story = wikimate.utils.replay(this.wikimate('journal'));
        return {id: action.id, type: 'move', order: _.pluck(story, 'id')};
      default:
        throw "Unknown action type: " + action.type;
    }
  }

  wikimate.fn.undo = function() {
    var action = this.find('.wikimate-journal').journal('pop');
    if (!action) {
      return;
    }
    this.find('.wikimate-story').story('execute', revert.apply(this, [action]));
    return action;
  };
})(jQuery);
