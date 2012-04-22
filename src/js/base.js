(function($) {
  $.plugin = function(name, methods) {
    $.fn[name] = function(method) {
      // Method calling logic
      if (methods[method]) {
        return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
      } else if (typeof method === 'object' || !method) {
        return methods.init.apply(this, arguments);
      } else {
        $.error('Method ' +  method + ' does not exist on jQuery.' + name);
      }
    };
  };

  window.wikimate = {
    version: '0.0.1',
    plugins: {},
    events: {},
    utils: (function() {
      function randomBytes(n) {
        var results = [];
        for (var i = 1; 1 <= n ? i <= n : i >= n; 1 <= n ? i++ : i--) {
          results.push(randomByte());
        }
        return results.join('');
      }
      function randomByte() {
        return (((1 + Math.random()) * 0x100) | 0).toString(16).substring(1);
      }

      return {
        generateId: function() {
          return randomBytes(8);
        },
        replay: function(events) {
          var story = [];
          function itemById(id) {
            return _.find(story, function(item) {
              return item.id === id;
            });
          }
          function itemIndexById(id) {
            return story.indexOf(itemById(id));
          }
          _.each(events, function(e) {
            switch(e.type) {
              case "add":
                var item = $.extend({}, e.item);
                if(e.after) {
                  var index = itemIndexById(e.after);
                  story.splice(index + 1, 0, item);
                } else {
                  story.push(item);
                }
                break;
              case "edit":
                itemById(e.id).text = e.item.text;
                break;
              case "remove":
                story.splice(itemIndexById(e.id), 1);
                break;
              case 'move':
                story = _.sortBy(story, function(item) {
                  return e.order.indexOf(item.id);
                });
                break;
            }
          });
          return story;
        }
      };
    })(),
    fn: {
      init: function(options) {
        return this.addClass('wikimate').wikimate('story', options);
      }
    }
  };

  $.plugin('wikimate', wikimate.fn);

})(jQuery);
