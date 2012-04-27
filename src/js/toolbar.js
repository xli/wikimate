(function($) {
  $.plugin('wikimate_toolbar', {
    init: function(options) {
      var $this = this;
      var toolbarPanel = $('<div/>').addClass('wikimate-toolbar-panel');
      for (var prop in wikimate.plugins) {
        if (prop == 'factory') {
          continue;
        }
        var title = wikimate.plugins[prop].title;
        var button = $('<button type="button"/>')
          .addClass('new-plugin-item-button')
          .text(title.charAt(0))
          .prop('title', "Click or Drag&Drop to create a new " + title)
          .data('plugin', prop)
          .click(function() {
            $this.parents('.wikimate:first').wikimate('newItem', {type: $(this).data('plugin')}).story_item('edit');
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
      return this.append(toolbarToggle).append(toolbarPanel).sticky();
    }
  });
})(jQuery);
