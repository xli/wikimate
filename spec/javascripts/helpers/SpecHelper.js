
var Keyboard = {
  hit: function(element, c) {
    var code = c.charCodeAt(0);
    element.trigger({type: 'keydown', which: code});
    element.trigger({type: 'keypress', which: code});
    element.trigger({type: 'keyup', which: code});
  }
}

