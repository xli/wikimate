(function($) {
  var completed = '✓';

  function todos(item) {
    return _.map(_.select(item.text.split("\n"), function(todo) {
      return todo.trim().length !== 0;
    }), function(todo) {
      if (todo[0] == completed) {
        return {status: todo[0], content: todo.substring(1)};
      } else {
        return {content: todo};
      }
    });
  }
  function newTodo(todo) {
    var status = $('<input type="checkbox"/>').prop('checked', todo.status == completed);
    var content = $('<span/>').text(todo.content);
    return $('<li/>').append(status).append(content);
  }
  wikimate.plugins.todo = {
    title: 'Todo list',
    emit: function(div, item) {
      _.each(todos(item), function(todo) {
        newTodo(todo).appendTo(div);
      });
      return this;
    },
    bind: function(div, item) {
      var $this = this;
      div.find('li input').each(function(index, input) {
        $(input).change(function(e) {
          var todos = div.find('li').map(function(_, li) {
            var status = $(li).find('input').prop('checked') ? completed : '';
            var content = $(li).find('span').text();
            return status + content;
          }).toArray();
          $this.story_item('save', todos.join("\n"));
          return true;
        });
      });
    },
    edit: function(item) {
      return this.wikimate_text_editor('init');
    }
  };
})(jQuery);
