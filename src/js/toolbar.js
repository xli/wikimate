(function($) {
  $.plugin('wikimate_toolbar', {
    init: function(storyElement) {
      var toolbarPanel = $('<div/>').addClass('wikimate-toolbar-panel');
      for (var prop in wikimate.plugins) {
        if (prop == 'factory') {
          continue;
        }
        var title = wikimate.plugins[prop].title;
        var button = $('<div/>')
          .addClass('new-plugin-item-button')
          .text(title.charAt(0))
          .prop('title', "Click or Drag&Drop to create a new " + title)
          .data('plugin', prop)
          .click(function() {
            storyElement.story('newItem', {type: $(this).data('plugin')}).story_item('edit');
          });
        toolbarPanel.append(button);
      }
      var toolbarToggle = $('<button type="button"/>').text('+').click(function(e) {
        if ($(this).text() == '+') {
          $(this).text('-');
          toolbarPanel.slideToggle('show');
        } else {
          $(this).text('+');
          toolbarPanel.slideToggle('hide');
        }
      });
      this.append(toolbarToggle).append(toolbarPanel);
      this.find('.new-plugin-item-button').draggable({
        connectToSortable: '.ui-sortable',
        helper: 'clone',
        stop: function(event, ui) {
          var newItemPlaceHolder = storyElement.find('.new-plugin-item-button');
          var after = newItemPlaceHolder.prev().prop('id');
          newItemPlaceHolder.remove();
          storyElement.story('newItem', {type: $(this).data('plugin')}, {after: after}).story_item('edit');
        }
      });

      return this.sticky();
    }
  });
})(jQuery);
