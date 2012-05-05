describe("InlineEditor", function() {
  beforeEach(function() {
    $("body").append($('<div id="sandbox"></div>'));
  });
  afterEach(function() {
    $('#sandbox').remove();
  });

  it("double click to inline edit with focus", function() {
    $('#sandbox').text('hello').wikimate_inline_editable();

    $('#sandbox').dblclick();
    expect($('#sandbox input').length).toEqual(1);
    expect($('#sandbox input:focus').val()).toEqual('hello');
  });

  it("click outside to save", function() {
    var saved = [];
    var canceled = [];
    $('#sandbox').text('hello').wikimate_inline_editable({
      saved: function(text) {
        saved.push(text);
      },
      canceled: function(text) {
        canceled.push(text);
      }
    });

    $('#sandbox').dblclick();
    $('#sandbox input').val('world');
    $(window.document.body).click();

    expect($('#sandbox').html()).toEqual('world');
    expect(saved.length).toEqual(1);
    expect(canceled.length).toEqual(0);
    expect(saved[0]).toEqual('world');
  });

  it("ESC to cancel", function() {
    var saved = [];
    var canceled = [];
    $('#sandbox').text('hello').wikimate_inline_editable({
      saved: function(text) {
        saved.push(text);
      },
      canceled: function(text) {
        canceled.push(text);
      }
    });

    $('#sandbox').dblclick();
    $('#sandbox input').val('world');
    Keyboard.hitEsc($('#sandbox input'));

    expect($('#sandbox').html()).toEqual('hello');
    expect(saved.length).toEqual(0);
    expect(canceled.length).toEqual(1);
    expect(canceled[0]).toEqual('hello');
  });

  it("Hit Enter to save", function() {
    var saved = [];
    var canceled = [];
    $('#sandbox').text('hello').wikimate_inline_editable({
      saved: function(text) {
        saved.push(text);
      },
      canceled: function(text) {
        canceled.push(text);
      }
    });

    $('#sandbox').dblclick();
    $('#sandbox input').val('world');
    Keyboard.hitEnter($('#sandbox input'));

    expect($('#sandbox').html()).toEqual('world');
    expect(saved.length).toEqual(1);
    expect(canceled.length).toEqual(0);
    expect(saved[0]).toEqual('world');
  });

  it("Cmd+s to save", function() {
    var saved = [];
    var canceled = [];
    $('#sandbox').text('hello').wikimate_inline_editable({
      saved: function(text) {
        saved.push(text);
      },
      canceled: function(text) {
        canceled.push(text);
      }
    });

    $('#sandbox').dblclick();
    $('#sandbox input').val('world');
    Keyboard.hitCmdS($('#sandbox input'));

    expect($('#sandbox').html()).toEqual('world');
    expect(saved.length).toEqual(1);
    expect(canceled.length).toEqual(0);
    expect(saved[0]).toEqual('world');
  });

  it("should not enter edit again when editing", function() {
    var saved = [];
    var canceled = [];
    $('#sandbox').text('hello').wikimate_inline_editable({});

    $('#sandbox').dblclick();
    $('#sandbox input').val('world');
    $('#sandbox input').dblclick();
    $('#sandbox').dblclick();

    expect($('#sandbox input').val()).toEqual('world');
  });
});
