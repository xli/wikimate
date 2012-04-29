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
})(jQuery);