/*
Copyright (c) 2012 Li Xiao, swing1979@gmail.com

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.*/
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
(function($) {
  function clearSelection() {
    if(document.selection && document.selection.empty) {
      document.selection.empty();
    } else if(window.getSelection) {
      var sel = window.getSelection();
      sel.removeAllRanges();
    }
  }

  $.plugin('story', {
    init: function(items) {
      var $this = this;
      $.each(items || [], function(i, item) {
        $('<div/>').story_item({data: item}).appendTo($this);
      });
      return this.addClass('wikimate-story').story('bindChangeEvents').story('dblclickToNewItem');
    },

    execute: function(action) {
      var item;
      action = wikimate.utils.deepClone(action);
      if (action.inside) {
        item = $('#' + action.inside);
        var itemStory = item.find('.wikimate-story:first');
        itemStory.story('execute', _.extend(action, {inside: null}));
        item.story_item('data').story = itemStory.story('data');
        return this;
      }

      if (action.type == 'add') {
        item = $('<div/>').story_item({data: action.item});
        if (action.after) {
          item.insertAfter($('#' + action.after));
        } else {
          item.prependTo(this);
        }
        item.effect('highlight');
      } else if (action.type == 'remove') {
        $('#' + action.id).removeClass('item').effect("explode", {}, 'normal', function() {
          $(this).remove();
        });
      } else if (action.type == 'edit') {
        $('#' + action.id).story_item('data', action.item).story_item('render').effect("highlight");
      } else if (action.type == 'move') {
        var pos = action.order.indexOf(action.id);
        var target = $('#' + action.id);
        if (pos === 0) {
          this.prepend(target);
        } else {
          target.insertAfter($('#' + action.order[pos - 1]));
        }
        target.effect("highlight");
      }
      return this;
    },

    data: function() {
      return $.map(this.find('> .item'), function(ele) {
        return $(ele).story_item('data');
      });
    },

    // return item element instead of story
    newItem: function(data, position) {
      if (position && position.inside) {
        return $('#' + position.inside + ' .wikimate-story:first').story('newItem', data, {after: position.after});
      }
      var item = $('<div/>').story_item({newItem: true, data: data});
      if (position && position.after) {
        return item.insertAfter($('#' + position.after));
      } else {
        return item.appendTo(this);
      }
    },

    bindChangeEvents: function() {
      var $this = this;
      return this.sortable({
        handle: '.item-handle',
        forcePlaceholderSize: true,
        placeholder: 'sort-placeholder',
        opacity: 0.8,
        update: function(event, ui) {
          ui.item.story_item('moved', {
            order: _.pluck($this.find('> .item'), 'id')
          });
        }
      });
    },

    dblclickToNewItem: function() {
      var $this = this;
      return this.dblclick(function(e) {
        e.preventDefault();
        e.stopPropagation();
        if (e.target == $this[0]) {
          clearSelection();
          $this.story('newItem').story_item('edit');
        }
      });
    }
  });

  $.extend(wikimate.events, {
    CHANGE: 'wikimate:change'
  });

  $.extend(wikimate.fn, {
    newItem: function(data, position) {
      return this.find('> .wikimate-story').story('newItem', data, position);
    },
    story: function(options) {
      if (options) {
        if (options.change) {
          this.on(wikimate.events.CHANGE, options.change);
        }
        var storyElement = $('<div />').story('init', options.story);
        var newFactoryItem = $('<div title="Add new Item">[+]</a>').addClass('add-new-factory').on('click', function(e) {
          return storyElement.story('newItem', {type: 'factory'});
        });

        return this.append(storyElement).append(newFactoryItem);
      } else {
        return this.find('> .wikimate-story').story('data');
      }
    }
  });
})(jQuery);
(function($) {
  $.plugin('story_item', (function(){
    function itemPlugin(item) {
      return wikimate.plugins[item.type] || wikimate.plugins.unknown;
    }

    function renderByPlugin($this) {
      var item = $this.story_item('data');
      // add another div inside for removing conflict highlighting with text area
      // after changed to edit mode
      // it's also easier to keep item div element clean
      var content = $('<div />').addClass('item-content');
      var plugin = itemPlugin(item);
      plugin.emit.apply($this, [content, item]);
      plugin.bind.apply($this, [content, item]);
      initActionBar(content);

      return $this.html(content);
    }

    function editByPlugin($this) {
      var item = $this.story_item('data');
      return itemPlugin(item).edit.apply($this, [item]);
    }

    function initItem(data) {
      var item = $.extend({id: wikimate.utils.generateId(), type: wikimate.default_story_item_type}, data || {});
      var plugin = itemPlugin(item);
      item = plugin.defaultData === undefined ? item : _.defaults(item, plugin.defaultData());
      return _.defaults(item, {text: ''});
    }

    var initActionBar = (function() {
      function createEditLink($this) {
        return $('<a href="javascript:void(0)" title="Click me or double click the content to edit">Edit</a>').on('click', function(e) {
          return $this.parent().story_item('edit');
        });
      }
      function createDeleteLink($this) {
        return $('<a href="javascript:void(0)" title="Remove section">Del</a>').on('click', function(e) {
          return $this.parent().story_item('remove');
        });
      }

      var cursor = {
        grab: function() {
          return this.css('cursor', 'grab').css('cursor', '-moz-grab').css('cursor', '-webkit-grab');
        },
        grabing: function() {
          return this.css('cursor', 'grabbing').css('cursor', '-moz-grabbing').css('cursor', '-webkit-grabbing');
        }
      };
      function createHandle() {
        var handle = $('<div />').addClass('item-handle').extend(cursor).grab();
        return handle.mousedown(function(e) {
          handle.grabing();
        }).mouseup(function() {
          handle.grab();
        });
      }

      return function($this) {
        return $this.hover(function(e) {
          var bar = $('<div />').addClass('item-action-bar')
            .append(createDeleteLink($this))
            .append(createEditLink($this))
            .append(createHandle());
          $this.append(bar);
        }, function(e) {
          $this.find('.item-action-bar').remove();
        });
      };
    })();

    var status;

    return {
      init: function(options) {
        var item = initItem(options.data);
        this.data('data', item);
        return this.addClass('item ' + item.type)
          .prop("id", item.id)
          .data('newItem', options.newItem)
          .story_item('render');
      },

      newItem: function() {
        return this.data('newItem');
      },

      status: function(newStatus) {
        if (newStatus) {
          status = newStatus;
          _.delay(function() { status = undefined; }, 100);
          return this;
        } else {
          return status;
        }
      },

      editable: function() {
        return status === undefined;
      },

      edit: function() {
        return editByPlugin(this);
      },

      data: function(newData) {
        if (newData) {
          return this.data('data', newData);
        } else {
          return this.data('data');
        }
      },

      render: function() {
        return renderByPlugin(this.story_item('status', 'rendering item'));
      },

      cancel: function() {
        return this.story_item('save', this.story_item('data').text);
      },

      save: function(text) {
        var item = this.story_item('data');
        if (text === '') {
          this.story_item('remove');
        } else if (this.data('newItem') || text != item.text) {
          this.story_item('update', {text: text});
        } else {
          this.story_item('render');
        }
        return this;
      },

      remove: function() {
        this.story_item('status', 'removing item');
        if (this.data('newItem')) {
          this.remove();
        } else {
          this.removeClass('item'); // remove item class to mark item has been deleted
          this.trigger(wikimate.events.CHANGE, {id: this.story_item('data').id, type: 'remove', inside: this.parents('.item:first').prop('id')});
          this.remove();
        }
      },

      update: function(changes) {
        this.story_item('status', 'updating item');
        var item = $.extend(this.story_item('data'), changes);
        if (this.data('newItem')) {
          renderByPlugin(this.removeData('newItem'));
          this.trigger(wikimate.events.CHANGE, {
            id: item.id,
            type: 'add',
            item: wikimate.utils.deepClone(item),
            after: this.prev().prop('id'),
            inside: this.parents('.item:first').prop('id')
          });
        } else {
          renderByPlugin(this);
          this.trigger(wikimate.events.CHANGE, {
            id: item.id,
            type: 'edit',
            item: wikimate.utils.deepClone(item),
            inside: this.parents('.item:first').prop('id')
          });
        }
        return this;
      },

      moved: function(moveInfo) {
        this.story_item('status', 'moved item');
        this.trigger(wikimate.events.CHANGE, {
          id: this.prop('id'),
          type: 'move',
          order: moveInfo.order,
          inside: this.parents('.item:first').prop('id')
        });
        return this;
      }
    };
  })());
})(jQuery);
/**
 * Attached simple editor shortcuts convention:
 *  Ctrl/Cmd + s to save
 *  Click outside of editing element to save
 *  Esc to cancel
 *  Enter to save, optional, ignored when pass option ignoreReturn = true
 */
(function($) {
  var KeyCode = {
    TAB:       9,
    RETURN:   13,
    ESC:      27,
    s:        83
  };

  var eventName = 'click.story_item_editor';

  function on(callback, $this, args) {
    if (callback) {
      callback.apply($this, args);
    }
  }

  $.plugin('editor_shortcuts', {
    /**
     * Options
     *   save: callback function, one argument options.value, applied to editor_shortcuts element jQuery object
     *   cancel: callback function, one argument options.value, applied to editor_shortcuts element jQuery object
     *   value: a value passed to callback functions
     *   ignoreReturn: does not do save when the value is true, default is false
     *   close: callback functions, one argument 'save'/'cancel', applied to editor_shortcuts element jQuery object
     */
    init: function(options) {
      return this.data('options', options)
        .editor_shortcuts('bindShortcuts')
        .editor_shortcuts('bindClickOutsideSave');
    },

    save: function() {
      var options = this.data('options');
      if (options) {
        $(window).off(eventName);
        on(options.save, this, [options.value]);
        on(options.close, this, ['save']);
      }
    },

    cancel: function() {
      var options = this.data('options');
      if (options) {
        $(window).off(eventName);
        on(options.cancel, this, [options.value]);
        on(options.close, this, ['cancel']);
      }
    },

    editingElement: function() {
      return this.parent()[0];
    },

    bindClickOutsideSave: function() {
      var $this = this;
      $(window).on(eventName, function(e) {
        var editingElement = $this.editor_shortcuts('editingElement');
        var eventTargetExistsInDom = $(e.target).closest('html')[0];
        if (eventTargetExistsInDom && editingElement && $(e.target).is(':visible') && !$.contains(editingElement, e.target)) {
          $this.editor_shortcuts('save');
        }
      });
      return this;
    },

    bindShortcuts: function() {
      var options = this.data('options');
      return this.keydown(function(e) {
        if (e.which == KeyCode.ESC) {
          e.preventDefault();
          e.stopPropagation();
          $(this).editor_shortcuts('cancel');
        } else if (e.which == KeyCode.RETURN) {
          if (options.ignoreReturn) {
            return;
          }
          e.preventDefault();
          e.stopPropagation();
          $(this).editor_shortcuts('save');
        } else if ((e.metaKey || e.ctrlKey) && e.which == KeyCode.s) { // cmd + s
          e.preventDefault();
          e.stopPropagation();
          $(this).editor_shortcuts('save');
        }
      });
    }
  });
})(jQuery);
(function($) {
  $.plugin('wikimate_inline_editable', {
    init: function(options) {
      this.dblclick(function(e) {
        if ($(this).find('.wikimate-inline-editor').length > 0) {
          return false;
        }
        var editor = $('<input type="text"/>')
          .addClass('wikimate-inline-editor')
          .val($(this).text())
          .editor_shortcuts({
            value: $(this).text(),
            save: function(before_edit_value) {
              this.parent().text(this.val());
              if (options.saved) {
                options.saved.apply(this, [this.val()]);
              }
            },
            cancel: function(before_edit_value) {
              this.parent().text(before_edit_value);
              if (options.canceled) {
                options.canceled.apply(this, [before_edit_value]);
              }
            }
          }).dblclick(function(e) {
            return false;
          });
        if (options && options.width) {
          editor.width(options.width);
        }
        $(this).empty().html(editor);
        editor.focus();
      });
      return this;
    }
  });
})(jQuery);
/**
 * Element should be absolute position by default, for example:
 * css:
 *   .wikimate-toolbar {
 *     position: absolute;
 *     top: 1px;
 *     right: 1px;
 *   }
 * JavaScript:
 *   $('.wikimate-toolbar').sticky();
 */

(function($) {
  $.plugin('sticky', {
    init: function() {
      var $this = this;
      $(window).scroll(function(e) {
        var scrollTop = parseInt($(window).scrollTop(), 10);
        var parentOffset = $this.parent().offset();
        if (scrollTop >= parentOffset.top && $this.css('position') != 'fixed') {
          var selfOffset = $this.offset();
          var top = selfOffset.top - parentOffset.top;
          $this.data('origin', selfOffset);
          $this.css('position', 'fixed').css('left', selfOffset.left + 'px');
          if ($this.offset().top < top) {
            $this.css('top', top + 'px');
          } else if ($this.offset().top > 1) {
            $this.css('top', top + 'px');
          }
        } else if (scrollTop < parentOffset.top) {
          var origin = $this.data('origin');
          $this.css('position', 'absolute').css('left', '');
        }
      });
      return this;
    }
  });
})(jQuery);jQuery.plugin('wikimate_text_editor', (function($) {
  var KeyCode = {
    RETURN:   13
  };
  var extraHeight = 16;

  function syncHeight(textarea) {
    var expectedTextHeight = textarea.prop('scrollHeight');
    if (expectedTextHeight > textarea.innerHeight()) {
      textarea.height(expectedTextHeight + extraHeight);
    }
  }

  function initActionBar($this, textarea) {
    var hint = 'Click me/outside to save, or Ctrl/Cmd + s to save. ESC to cancel';
    var saveButton = $('<a href="javascript:void(0)">Save</a>').prop('title', hint).click(function(e) {
      $this.find('.plain-text-editor').editor_shortcuts('save');
    });
    var bar = $('<div />').addClass('editor-action-bar').append(saveButton);
    $this.append(bar).hover(function(e) {
      bar.show();
    }, function(e) {
      bar.hide();
    });
    textarea.on('keydown.editor_action_bar', function() {
      textarea.off('.editor_action_bar');
      bar.show();
    });
  }

  return {
    init: function(options) {
      var item = this.story_item('data');
      var $this = this;
      var textarea = $("<textarea/>").text(item.text).addClass('plain-text-editor').editor_shortcuts(_.extend({
        save: function() {
          $this.story_item('save', textarea.val());
        },
        cancel: function() {
          $this.story_item('cancel');
        },
        close: function() {
        },
        ignoreReturn: true
      }, options)).on('keyup', function(e) {
        syncHeight(textarea);
        // in keyup so that we can findout the new RETURN is added into last line
        // could not find out a way to do this in keydown
        if (e.which == KeyCode.RETURN) {
          // Is it same on Windows?
          var text = textarea.val();
          if (text.trim().length > 0 && text.substr(-2) == "\n\n") {
            e.preventDefault();
            textarea.val(text.substr(0, text.length - 1));
            textarea.editor_shortcuts('save');
            $('<div/>').story_item({data: {type: item.type}, newItem: true}).insertAfter($this).story_item('edit');
          }
        }
      }).on('dblclick', function() {
        return false;
      }).focus();

      this.html(textarea);

      initActionBar(this, textarea);

      syncHeight(textarea);

      return this.wikimate_text_editor('moveCursorTo', item.text.length);
    },

    moveCursorTo: function(pos) {
      var textarea = this.find('> .plain-text-editor')[0];
      textarea.selectionStart = pos;
      textarea.selectionEnd = pos;
      return this;
    }
  };
})(jQuery));
(function($) {

  $.plugin('journal', (function() {

    function actionTooltip(journal, action) {
      switch(action.type) {
        case "move":
          return "Item was moved";
        case "add":
        case "remove":
        case "edit":
          var events = journal.journal('data');
          var story = wikimate.utils.replay(events.slice(0, events.indexOf(action)));
          var container = story.itemStoryByItemId(action.inside);
          var item = _.find(container, function(item) { return item.id === action.id; });
          var beforeChange = item ? item.text : undefined;
          var afterChange = action.item ? action.item.text : undefined;
          return JsDiff.convertChangesToXML(JsDiff.diffWords(beforeChange, afterChange)).replace(/\n/g, "<br/>");
        default:
          throw "Unknown action type " + action.type;
      }
    }

    function createAction(journal, action) {
      var identifier = action.type.charAt(0);
      return $('<a href="javascript:void(0)"/>').data('data', action)
        .addClass('action ' + action.type)
        .text(identifier)
        .hover(function(e) {
          $('#' + action.id).addClass('highlight');
          var tooltip = actionTooltip(journal, action);
          var rootOffset = journal.parent().offset();
          var offset = $(this).offset();
          offset.left -= rootOffset.left;
          offset.top -= rootOffset.top;
          var element = $('<div/>').addClass('diff')
            .html(tooltip)
            .appendTo(journal.parent())
            .css('left', offset.left + $(this).width() * 3 / 4);
          element.css('top', offset.top - element.height());
        }, function(e) {
          $('.wikimate .diff').remove();
          $('.wikimate .highlight').removeClass('highlight');
        });
    }
    var afterActionCreated;
    return {
      init: function(actions, after_action_created) {
        var $this = this;
        afterActionCreated = after_action_created;
        $.each(actions || [], function(i, action) {
          $this.journal('push', action);
        });
        return this;
      },
      push: function(action) {
        var actionElement = createAction(this, action);
        this.append(actionElement);
        if (afterActionCreated) {
          afterActionCreated(actionElement);
        }
        return this;
      },
      pop: function() {
        var lastAction = this.find('> .action:last');
        var data = lastAction.data('data');
        lastAction.remove();
        return data;
      },
      data: function() {
        return $.map(this.find('> .action'), function(element) {
          return $(element).data('data');
        });
      }
    };
  })());

  wikimate.fn.journal = function(journal, afterActionCreated) {
    if (journal) {
      var element = $('<div />').addClass('wikimate-journal').journal('init', journal, afterActionCreated);
      // handler is processed before handlers on wikimate element
      this.find('> .wikimate-story').on(wikimate.events.CHANGE, function(e, action) {
        element.journal('push', action);
      });
      return this.append(element);
    } else {
      return this.find('> .wikimate-journal').journal('data');
    }
  };
})(jQuery);
(function($) {
  function revert(action) {
    var story, container;
    switch(action.type) {
      case 'remove':
        story = wikimate.utils.replay(this.wikimate('journal'));
        container = story.itemStoryByItemId(action.inside);
        var item = _.find(container, function(item) { return item.id === action.id; });
        var index = container.indexOf(item);
        var after = index === 0 ? null : container[index - 1].id;
        return {id: action.id, type: 'add', item: item, after: after, inside: action.inside};
      case 'add':
        return {id: action.id, type: 'remove', item: action.item, inside: action.inside};
      case 'edit':
        story = wikimate.utils.replay(this.wikimate('journal'));
        container = story.itemStoryByItemId(action.inside);
        var prev = _.find(container, function(item) { return item.id === action.id; });
        return {id: action.id, type: 'edit', item: wikimate.utils.deepClone(prev), inside: action.inside};
      case 'move':
        story = wikimate.utils.replay(this.wikimate('journal'));
        container = story.itemStoryByItemId(action.inside);
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
(function($) {
  $.plugin('dropfile', {
    // options:
    //   field_name: String, post file as form field name
    //   post_url: String, post target url
    //   start: function, after dropped, before uploading
    //          params: xhr, file
    //   complete: function, callback after uploaded
    //          params: event, file
    init: function(options) {
      var $this = this;
      return this.on("drop", function(e) {
        e.stopPropagation();
        e.preventDefault();
        if (!e.originalEvent.dataTransfer) {
          return;
        }
        var file = e.originalEvent.dataTransfer.files[0];
        if (!file) {
          return;
        }
        // Uploading - for Firefox, Google Chrome and Safari
        var xhr = new XMLHttpRequest();
        xhr.open("post", options.post_url, true);
        xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
        options.start.apply($this, [xhr, file]);
        // File uploaded
        xhr.addEventListener("load", function (e) {
          // Calling complete function
          options.complete.apply($this, [e, file]);
        }, false);

        var fd = new FormData();
        fd.append(options.field_name, file);
        xhr.send(fd);
      });
    }
  });
})(jQuery);
(function($) {
  function transform(story_item_element, type) {
    return story_item_element.empty().removeClass('factory').story_item({data: {type: type}, newItem: true});
  }

  wikimate.plugins.factory = {
    emit: function(div, item) {
      var list = $('<ul/>');
      for (var prop in wikimate.plugins) {
        var title = wikimate.plugins[prop].title;
        if (title) {
          var link = $('<a href="javascript:void(0)"/>')
            .addClass('new-plugin-item-link new-' + prop)
            .text(title)
            .data('plugin', prop);
          $('<li/>').html(link).appendTo(list);
        }
      }
      this.data('newItem', true);
      return div.html('Double-Click to Edit or Add:').append(list);
    },
    edit: function() {
      return transform(this, wikimate.default_story_item_type).story_item('edit');
    },
    bind: function(div, item) {
      var itemEle = this;
      div.find('.new-plugin-item-link').click(function(e) {
        transform(itemEle, $(this).data('plugin')).story_item('edit');
      });
      div.on('dblclick', function(e) {
        if (itemEle.story_item('editable')) {
          itemEle.story_item('edit');
        }
      });
    }
  };
})(jQuery);
(function($) {
  wikimate.plugins.paragraph = {
    // item: { "id": "1", "type": "paragraph", "text": "paragraph 1" }
    emit: function(div, item) {
      var html = $.map(item.text.split("\n"), function(text) {
        return text.length > 0 ? "<p>" + text + "</p>" : '';
      }).join('');
      return div.html(html);
    },
    bind: function(div, item) {
      var $this = this;
      div.on('dblclick', function(e) {
        if ($this.story_item('editable')) {
          $this.story_item('edit');
        }
      });
    },
    edit: function(item) {
      return this.wikimate_text_editor('init');
    }
  };
})(jQuery);
(function($) {

  function save($this, ed) {
    var text = ed.getContent();
    ed.remove();
    ed.destroy();
    $this.story_item('save', text);
  }
  function cancel($this, ed) {
    ed.remove();
    ed.destroy();
    $this.story_item('cancel');
  }

  wikimate.plugins.rdoc = {
    title: 'Rich Document',
    editor_options: {},
    emit: function(div, item) {
      return div.html(item.text);
    },

    bind: function(div, item) {
      var $this = this;
      div.on('dblclick', function(e) {
        if ($this.story_item('editable')) {
          $this.story_item('edit');
        }
      });
    },

    edit: function(item) {
      var $this = this;
      var id = wikimate.utils.generateId();
      var textarea = $('<textarea/>').prop('id', id).text(item.text).appendTo(this.empty()).editor_shortcuts({
        save: function() {
          save($this, tinymce.activeEditor);
        },
        cancel: function() {
          cancel($this, tinymce.activeEditor);
        },
        close: function() {
        },
        ignoreReturn: true
      });
      tinymce.init(_.extend({
        mode : "exact",
        elements: id,
        theme : "advanced",
        plugins : "advlink,advimage,advlist,autoresize,autolink,save,table,fullscreen,spellchecker,wordcount,contextmenu,media,lists,inlinepopups",
        theme_advanced_buttons1 : "save,cancel,|,bold,italic,underline,strikethrough,hr,|,justifyleft,justifycenter,justifyright,justifyfull,|,bullist,numlist,|,outdent,indent,|,undo,redo,|,link,unlink,image,code,removeformat",
        theme_advanced_buttons2 : "table,fullscreen,media,formatselect",
        theme_advanced_buttons3 : "",
        theme_advanced_toolbar_location : "top",
        theme_advanced_toolbar_align : "left",
        // theme_advanced_statusbar_location : "bottom",
        auto_focus: id,
        save_onsavecallback: function(ed) {
          save($this, ed);
          return false;
        },
        save_oncancelcallback: function(ed) {
          cancel($this, ed);
          return false;
        }
      }, wikimate.plugins.rdoc.editor_options));
      return this;
    }
  };
})(jQuery);
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
    defaultData: function() {
      return {text: 'one line one todo item'};
    },
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
    edit: function(item) {
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
(function($) {
  function markdown(text) {
    return new Showdown.converter().makeHtml(text);
  }

  wikimate.plugins.markdown = {
    // item: { "id": "1", "type": "markdown", "text": "markdown text" }
    title: "Markdown",
    emit: function(div, item) {
      return div.html(markdown(item.text));
    },
    bind: function(div, item) {
      var $this = this;
      div.on('dblclick', function(e) {
        if ($this.story_item('editable')) {
          $this.story_item('edit');
        }
      });
    },
    edit: function(item) {
      return this.wikimate_text_editor('init');
    }
  };
})(jQuery);
(function($) {
  wikimate.plugins.unknown = {
    emit: function(div, item) {
      return div.addClass('unknown').text("Unexpected item: " + JSON.stringify({type: item.type, text: item.text}));
    },
    bind: function(div, item) {
    },
    edit: function(item) {
      return false;
    }
  };
})(jQuery);
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
      var panel = $('<div/>').addClass('wikimate-layout-panel').story(item.story);
      var heading = $('<h2/>').addClass('wikimate-layout-heading').text(item.text);
      var addLink = $('<div title="Add new Item">[+]</a>').addClass('add-new-factory');
      return div.html(heading).append(panel).append(addLink);
    },
    bind: function(div, item) {
      var story_item_element = this;
      var internalStoryElement = div.find('> .wikimate-layout-panel')
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
      this.find('> .item-content > .wikimate-layout-heading').dblclick();
      return this;
    }
  };
})(jQuery);
