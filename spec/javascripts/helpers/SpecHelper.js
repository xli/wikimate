
var Keyboard = {
  hit: function(element, code, c) {
    element.trigger({type: 'keydown', which: code, keyCode: code});
    element.trigger({type: 'keypress', which: code, keyCode: code});
    if (c) {
      $(element).text($(element).text() + c);
    }
    element.trigger({type: 'keyup', which: code, keyCode: code});
  },
  hitEnter: function(element) {
    Keyboard.hit(element, 13, "\n");
  },
  hitEsc: function(element) {
    Keyboard.hit(element, 27);
  }
}

