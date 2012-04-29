(function($) {
  function revert(action) {
    var story;
    switch(action.type) {
      case 'remove':
        story = wikimate.utils.replay(this.wikimate('journal'));
        var container = story.itemStoryByItemId(action.inside);
        var item = _.find(container, function(item) { return item.id === action.id; });
        var index = container.indexOf(item);
        var after = index === 0 ? null : container[index - 1].id;
        return {id: action.id, type: 'add', item: item, after: after, inside: action.inside};
      case 'add':
        return {id: action.id, type: 'remove', item: action.item, inside: action.inside};
      case 'edit':
        story = wikimate.utils.replay(this.wikimate('journal'));
        var container = story.itemStoryByItemId(action.inside);
        var prev = _.find(container, function(item) { return item.id === action.id; });
        return {id: action.id, type: 'edit', item: wikimate.utils.deepClone(prev), inside: action.inside};
      case 'move':
        story = wikimate.utils.replay(this.wikimate('journal'));
        var container = story.itemStoryByItemId(action.inside);
        return {id: action.id, type: 'move', order: _.pluck(container, 'id'), inside: action.inside};
      default:
        throw "Unknown action type: " + action.type;
    }
  }

  wikimate.fn.undo = function() {
    var action = this.find('> .wikimate-journal').journal('pop');
    if (!action) {
      return;
    }
    this.find('> .wikimate-story').story('execute', revert.apply(this, [action]));
    return action;
  };
})(jQuery);
