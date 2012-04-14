describe("Journal", function() {
  beforeEach(function() {
    $("body").append($('<div id="sandbox"></div>'));
  });
  afterEach(function() {
    $('#sandbox').remove();
  })

  it("show add item action in journal panel", function() {
    $('#sandbox').wikimate({});

    $('#sandbox .wikimate-panel').dblclick();
    $('.wikimate-panel textarea').text("hello world\n");
    Keyboard.hitEnter($('.wikimate-panel textarea'));

    var actions = $('#sandbox .wikimate-journal .action');
    expect(actions.length).toEqual(1);
  });

  it("records actions", function() {
    $('#sandbox').wikimate({});

    $('#sandbox .wikimate-panel').dblclick();
    $('.wikimate-panel textarea').text("hello\n");
    Keyboard.hitEnter($('.wikimate-panel textarea'));

    $('.wikimate-panel .item').click();
    $('.wikimate-panel textarea').text("hello2\n");
    Keyboard.hitEnter($('.wikimate-panel textarea'));

    $('.wikimate-panel .item').click();
    $('.wikimate-panel textarea').text("").focusout();

    var actions = $('#sandbox .wikimate-journal .action').map(function(_, element) {
      return $(element).data('data');
    });
    expect(actions.length).toEqual(3);
    expect(actions[0].type).toEqual('add');
    expect(actions[1].type).toEqual('edit');
    expect(actions[2].type).toEqual('remove');
  });

  it("highlight item and action when mouseover", function() {
    $('#sandbox').wikimate({
      story: [{ "id": "1", "type": "paragraph", "text": "paragraph 1\n" }],
      journal: [{id: '1', type: 'add', item: { "id": "1", "type": "paragraph", "text": "paragraph 1\n" }}]
    });

    expect($('#1').hasClass('highlight')).toEqual(false);
    $('.wikimate-journal .action').mouseover();
    expect($('#1').hasClass('highlight')).toEqual(true);
    $('.wikimate-journal .action').mouseleave();
    expect($('#1').hasClass('highlight')).toEqual(false);
  });

});
