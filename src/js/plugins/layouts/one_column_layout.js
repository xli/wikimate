(function($) {
  wikimate.plugins.one_column_layout = {
    // item: 
    //   {
    //     "id": "1", "type": "one_column_layout", "text": "text heading", "story": [{
    //       "id": "be89984c13c0c803",
    //       "type": "paragraph",
    //       "text": "<h1> Wiki </h1>\n"
    //     }]
    //   }
    title: 'One Column Layout',
    defaultData: function() {
      return {text: 'Heading', story: []};
    },
    emit: function(div, item) {
      var panel = $('<div/>').addClass('wikimate-layout-panel');
      var heading = $('<h2/>').addClass('wikimate-layout-heading').text(item.text);
      var addLink = $('<div title="Add new Item">[+]</a>').addClass('add-new-factory');
      return div.html(heading).append(panel).append(addLink);
    },
    bind: function(div, item) {
      var story_item_element = this;
      var internalStoryElement = div.find('> .wikimate-layout-panel')
        .story(item.story)
        .on(wikimate.events.CHANGE, function(e, action) {
          var content = $(this);
          story_item_element.story_item('data').story = content.story('data');
        });
      div.find('> .wikimate-layout-heading').wikimate_inline_editable({
        width: '98%',
        saved: function(text) {
          story_item_element.story_item('update', {text: text});
        }
      });
      div.find('> .add-new-factory').on('click', function(e) {
        return internalStoryElement.story('newItem', {type: 'factory'});
      });
    },
    edit: function(item) {
      this.find('.wikimate-layout-heading').dblclick();
      return this;
    }
  };
})(jQuery);
