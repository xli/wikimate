(function($) {
  // function change(item) {
  //   item.text = "heading: " + (item.heading || '') + "\nstory: " + JSON.stringify(item.story || []);
  //   return item;
  // }

  wikimate.plugins.one_column_layout = {
    // item: 
    //   {
    //     "id": "1", "type": "one_column_layout", "heading": "text heading", "story": [{
    //       "id": "be89984c13c0c803",
    //       "type": "paragraph",
    //       "text": "<h1> Wiki </h1>\n"
    //     }]
    //   }
    title: 'One Column Layout',
    defaultData: function() {
      return {heading: 'Heading', story: []};
    },
    emit: function(div, item) {
      var panel = $('<div/>').addClass('wikimate-layout-panel');
      var heading = $('<h2/>').addClass('wikimate-layout-heading').text(item.heading);
      return div.html(heading).append(panel);
    },
    bind: function(div, item) {
      // var story_item = this;
      // div.find('> .wikimate-layout-panel')
      //   .story(item.story)
      //   .on(wikimate.events.CHANGE, function(e, action) {
      //     e.stopPropagation();
      //     e.preventDefault();
      //     var content = $(this);
      //     story_item.story_item('update', change({heading: item.heading, story: content.story('data')}));
      //   });
      var itemEle = this;
      div.find('> .wikimate-layout-heading').wikimate_inline_editable({
        saved: function(text) {
          itemEle.story_item('update', {heading: text});
        }
      });
    },
    edit: function(item) {
      this.find('.wikimate-layout-heading').dblclick();
      return this;
    }
  };
})(jQuery);
