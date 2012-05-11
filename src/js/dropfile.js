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
