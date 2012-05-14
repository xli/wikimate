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
    default_story_item_type: 'markdown',
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

      function itemStoryByItemId(story, id) {
        if (!id) {
          return story;
        }
        var target;
        _.any(story, function(item) {
          if (item.id === id) {
            if (!item.story) {
              item.story = [];
            }
            target = item.story;
            return true;
          } else if (item.story) {
            target = itemStoryByItemId(item.story, id);
            return _.isObject(target);
          }
          return false;
        });
        return target;
      }
      function itemById(story, id) {
        return _.find(story, function(item) { return item.id === id; });
      }
      function itemIndexById(story, id) {
        return story.indexOf(itemById(story, id));
      }

      return {
        generateId: function() {
          return randomBytes(8);
        },
        replay: function(events) {
          var story = [];
          _.each(events, function(e) {
            var container = itemStoryByItemId(story, e.inside);
            switch(e.type) {
              case "add":
                var item = wikimate.utils.deepClone(e.item);
                if (e.after) {
                  var index = itemIndexById(container, e.after);
                  container.splice(index + 1, 0, item);
                } else {
                  container.push(item);
                }
                break;
              case "edit":
                itemById(container, e.id).text = e.item.text;
                break;
              case "remove":
                var itemIndex = itemIndexById(container, e.id);
                container.splice(itemIndex, 1);
                break;
              case 'move':
                container.sort(function(a, b) {
                  var ai = e.order.indexOf(a.id);
                  var bi = e.order.indexOf(b.id);
                  return ai == bi ? 0 : (ai > bi ? 1 : -1);
                });
                break;
              default:
                throw "Unknown event type: " + e.type;
            }
          });
          return $.extend(story, {
            itemStoryByItemId: function(id) {
              return itemStoryByItemId(this, id);
            }
          });
        },
        deepClone: function(obj) {
          return $.parseJSON(JSON.stringify(obj));
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
