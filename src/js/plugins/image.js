(function($) {
  wikimate.plugins.image = {
    // item: { "id": "1", "type": "image", "text": "http://xxxxx/xx.jpg" }
    title: "Image",
    emit: function(div, item) {
      return div.html($('<img/>').prop('src', item.text));
    },
    bind: function(div, item) {
      var $this = this;
      div.click(function(e) {
        if ($this.story_item('editable')) {
          $this.story_item('edit');
        }
      });
    },
    edit: function(div, item) {
      var itemElement = this;
      var title = this.story_item('newItem') ? "Add" : "Edit";
      $('<fieldset/>')
        .append($('<label for="image_url">Image URL: </label>'))
        .append($('<input class="image_url_input" type="text" size="50"/>').val(item.text))
        .dialog({
          title: title,
          modal: true,
          width: 600,
          buttons: {
            Done: function() {
              itemElement.story_item('save', $(this).find('input').val());
              $(this).dialog('close');
            },
            Cancel: function() {
              $(this).dialog('close');
            }
          }
        });
    }
  };
})(jQuery);
