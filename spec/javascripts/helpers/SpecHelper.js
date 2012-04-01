
var Keyboard = {
  hit: function(element, code) {
    element.trigger({type: 'keydown', which: code});
    element.trigger({type: 'keypress', which: code});
    element.trigger({type: 'keyup', which: code});
  },
  hitEnter: function(element) {
    Keyboard.hit(element, 13);
  } 
}

