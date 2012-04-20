describe("Journal", function() {
  beforeEach(function() {
    $("body").append($('<div id="sandbox"></div>'));
  });
  afterEach(function() {
    $('#sandbox').remove();
  });

  it("show add item action in journal panel", function() {
    $('#sandbox').wikimate({}).wikimate('journal', []);

    $('#sandbox .wikimate-story').dblclick();
    $('.wikimate-story textarea').text("hello world\n");
    Keyboard.hitEnter($('.wikimate-story textarea'));

    var actions = $('#sandbox').wikimate('journal');
    expect(actions.length).toEqual(1);
  });

  it("records actions", function() {
    $('#sandbox').wikimate({}).wikimate('journal', []);

    $('#sandbox .wikimate-story').dblclick();
    $('.wikimate-story textarea').text("hello\n").focusout();

    $('.item').story_item('edit');
    $('.wikimate-story textarea').text("hello2\n").focusout();

    $('.item').story_item('edit');
    $('.wikimate-story textarea').text("").focusout();

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
      story: [{ "id": "1", "type": "paragraph", "text": "paragraph 1\n" }]
    }).wikimate('journal', [{id: '1', type: 'add', item: { "id": "1", "type": "paragraph", "text": "paragraph 1\n" }}]);

    expect($('#1').hasClass('highlight')).toEqual(false);
    $('.wikimate-journal .action').mouseover();
    expect($('#1').hasClass('highlight')).toEqual(true);
    $('.wikimate-journal .action').mouseleave();
    expect($('#1').hasClass('highlight')).toEqual(false);
  });

  it("undo last action", function() {
    $('#sandbox').wikimate({}).wikimate('journal', []);

    $('#sandbox .wikimate-story').dblclick();
    $('.wikimate-story textarea').text("hello\n").focusout();

    $('.item').story_item('edit');
    $('.wikimate-story textarea').text("hello2\n").focusout();

    $('.item').story_item('edit');
    $('.wikimate-story textarea').text("").focusout();

    $('#sandbox').wikimate('undo');

    var actions = $('#sandbox').wikimate('journal');
    expect(actions.length).toEqual(2);
    expect(actions[0].type).toEqual('add');
    expect(actions[1].type).toEqual('edit');

    var items = $('#sandbox').wikimate('story');
    expect(items.length).toEqual(1);
    expect(items[0].text).toEqual("hello2\n");
  });

  it("undo remove action should add item back to removed position", function() {
    $('#sandbox').wikimate({}).wikimate('journal', []);

    $('#sandbox').wikimate('newItem');
    $('#sandbox textarea').text("hello").focusout();
    $('#sandbox').wikimate('newItem');
    $('#sandbox textarea').text("hello2").focusout();
    $('#sandbox').wikimate('newItem');
    $('#sandbox textarea').text("hello3").focusout();

    var items = $('#sandbox').wikimate('story');

    $('#' + items[1].id).story_item('edit');

    $('#sandbox textarea').text("").focusout();
    $('#' + items[0].id).story_item('edit');
    $('#sandbox textarea').text("").focusout();

    $('#sandbox').wikimate('undo');
    var actions = $('#sandbox').wikimate('journal');
    expect(actions.length).toEqual(4);
    expect(actions[0].type).toEqual('add');
    expect(actions[1].type).toEqual('add');
    expect(actions[2].type).toEqual('add');
    expect(actions[3].type).toEqual('remove');

    items = $('#sandbox').wikimate('story');
    expect(items.length).toEqual(2);
    expect(items[0].text).toEqual("hello");
    expect(items[1].text).toEqual("hello3");

    $('#sandbox').wikimate('undo');

    actions = $('#sandbox').wikimate('journal');
    expect(actions.length).toEqual(3);
    expect(actions[0].type).toEqual('add');
    expect(actions[1].type).toEqual('add');
    expect(actions[2].type).toEqual('add');

    items = $('#sandbox').wikimate('story');
    expect(items.length).toEqual(3);
    expect(items[0].text).toEqual("hello");
    expect(items[1].text).toEqual("hello2");
    expect(items[2].text).toEqual("hello3");
  });

  it("undo add action should remove item", function() {
    $('#sandbox').wikimate({}).wikimate('journal', []);

    $('#sandbox').wikimate('newItem');
    $('#sandbox textarea').text("hello").focusout();
    $('#sandbox').wikimate('newItem');
    $('#sandbox textarea').text("hello2").focusout();
    $('#sandbox').wikimate('newItem');
    $('#sandbox textarea').text("hello3").focusout();

    $('#sandbox').wikimate('undo');

    var actions = $('#sandbox').wikimate('journal');
    expect(actions.length).toEqual(2);
    expect(actions[0].type).toEqual('add');
    expect(actions[1].type).toEqual('add');
    var items = $('#sandbox').wikimate('story');
    expect(items.length).toEqual(2);
    expect(items[0].text).toEqual("hello");
    expect(items[1].text).toEqual("hello2");
  });

  it("undo edit action should update item", function() {
    $('#sandbox').wikimate({
      story: [{ "id": "3", "type": "paragraph", "text": "3" }, { "id": "1", "type": "paragraph", "text": "2" }]
    }).wikimate('journal', [
      {"id": "1", "type": "add", "item": { "id": "1", "type": "paragraph", "text": "1" }},
      {"id": "3", "type": "add", "item": { "id": "1", "type": "paragraph", "text": "3" }, after: '1'},
      {"id": "1", "type": "move", "prevOrder": ["1", "3"], "order": ["3", "1"]},
      {"id": "1", "type": "edit", "item": { "id": "1", "type": "paragraph", "text": "2" }}
    ]);

    $('#sandbox').wikimate('undo');
    var actions = $('#sandbox').wikimate('journal');
    expect(actions.length).toEqual(3);

    var items = $('#sandbox').wikimate('story');
    expect(items.length).toEqual(2);
    expect(items[1].text).toEqual("1");
  });

  it("undo move action should move item back to original position", function() {
    $('#sandbox').wikimate({}).wikimate('journal', []);

    $('#sandbox').wikimate('newItem');
    $('#sandbox textarea').text("hello").focusout();
    $('#sandbox').wikimate('newItem');
    $('#sandbox textarea').text("hello2").focusout();
    $('#sandbox').wikimate('newItem');
    $('#sandbox textarea').text("hello3").focusout();

    var items = $('#sandbox .item');
    $(items[1]).insertAfter(items[2]);

    $(items[1]).story_item('moved', {
      prevOrder: [items[0].id, items[1].id, items[2].id],
      order: [items[0].id, items[2].id, items[1].id]
    });

    // check move successfully
    expect($('#sandbox').wikimate('journal').length).toEqual(4);

    $('#sandbox').wikimate('undo');

    var actions = $('#sandbox').wikimate('journal');
    expect(actions.length).toEqual(3);
    expect(actions[0].type).toEqual('add');
    expect(actions[0].type).toEqual('add');
    expect(actions[0].type).toEqual('add');

    var orderedText = $.map($('#sandbox .item'), function(item) {
      return $(item).text();
    });
    expect(orderedText).toEqual(['hello', 'hello2', 'hello3']);
  });
});
