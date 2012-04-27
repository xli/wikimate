describe("OneColumnLayout", function() {
  beforeEach(function() {
    $("body").append($('<div id="sandbox"></div>'));
  });
  afterEach(function() {
    $('#sandbox').remove();
  });

  it("render item as a dashboard with heading and panel", function() {
    $('#sandbox').wikimate({});
    $('#sandbox').wikimate('newItem', {type: 'one_column_layout'});
    expect($('#sandbox .item').length).toEqual(1);
    expect($('#sandbox .item .wikimate-layout-heading').length).toEqual(1);
    expect($('#sandbox .item .wikimate-layout-panel').length).toEqual(1);
  });

  it("render item with a default heading text", function() {
    $('#sandbox').wikimate({});
    $('#sandbox').wikimate('newItem', {type: 'one_column_layout'});
    expect($('#sandbox .item .wikimate-layout-heading').text()).toEqual('Heading');
  });

  it("edit heading", function() {
    $('#sandbox').wikimate({});
    $('#sandbox').wikimate('newItem', {type: 'one_column_layout'}).story_item('edit');
    expect($('#sandbox .item .wikimate-layout-heading input:focus').val()).toEqual('Heading');
  });

  it("save edited heading", function() {
    $('#sandbox').wikimate({});
    $('#sandbox').wikimate('newItem', {type: 'one_column_layout'}).story_item('edit');

    $('#sandbox .item .wikimate-layout-heading input').val('hello').focusout();

    expect($('#sandbox .item .wikimate-layout-heading').text()).toEqual('hello');
    var item = $('#sandbox .item').story_item('data');
    expect(item.text).toEqual('hello');
  });

  it("cancel editing heading", function() {
    $('#sandbox').wikimate({});
    $('#sandbox').wikimate('newItem', {type: 'one_column_layout'}).story_item('edit');
    $('#sandbox .item .wikimate-layout-heading input').val('hello');

    Keyboard.hitEsc($('#sandbox .item .wikimate-layout-heading input'));

    expect($('#sandbox .item .wikimate-layout-heading').text()).toEqual('Heading');
    var item = $('#sandbox .item').story_item('data');
    expect(item.text).toEqual('Heading');
  });

  it("double click to add story item into panel", function() {
    $('#sandbox').wikimate({});
    $('#sandbox').wikimate('newItem', {type: 'one_column_layout'});
    $('#sandbox .item .wikimate-layout-panel').story('newItem').story_item('edit');

    expect($('.wikimate-layout-panel .item').length).toEqual(1);
    expect($('.wikimate-layout-panel .paragraph').length).toEqual(1);
    expect($('.wikimate-layout-panel .item textarea').length).toEqual(1);

    $('.wikimate-layout-panel .item textarea').text('hello').focusout();
    expect($('.wikimate-layout-panel .item p').text()).toEqual('hello');
  });

  it("should update story after added story item into panel", function() {
    $('#sandbox').wikimate({});
    $('#sandbox').wikimate('newItem', {type: 'one_column_layout'});

    $('#sandbox .item .wikimate-layout-panel').story('newItem').story_item('edit');
    $('.wikimate-layout-panel .item textarea').text('hello').focusout();

    var data = $('#sandbox .one_column_layout').story_item('data');
    expect(data.story.length).toEqual(1);
    expect(data.story[0].text).toEqual('hello');
  });

  it("action of editing one_column_layout story should contain inside property", function() {
    var changes = [];
    $('#sandbox').wikimate({change: function(event, action) { changes.push(action); }});
    $('#sandbox').wikimate('newItem', {type: 'one_column_layout'}).story_item('save');

    $('#sandbox .item .wikimate-layout-panel').story('newItem').story_item('edit');
    $('.wikimate-layout-panel .item textarea').text('hello').focusout();

    expect(changes.length).toEqual(2);
    expect(changes[0].type).toEqual('add');
    expect(changes[0].item.type).toEqual('one_column_layout');

    expect(changes[1].type).toEqual('add');
    expect(changes[1].item.type).toEqual('paragraph');
    expect(changes[1].inside).toEqual(changes[0].item.id);
  });
});
