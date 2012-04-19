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