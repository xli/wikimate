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
    expect(item.heading).toEqual('hello');
  });

  it("cancel editing heading", function() {
    $('#sandbox').wikimate({});
    $('#sandbox').wikimate('newItem', {type: 'one_column_layout'}).story_item('edit');
    $('#sandbox .item .wikimate-layout-heading input').val('hello');

    Keyboard.hitEsc($('#sandbox .item .wikimate-layout-heading input'));

    expect($('#sandbox .item .wikimate-layout-heading').text()).toEqual('Heading');
    var item = $('#sandbox .item').story_item('data');
    expect(item.heading).toEqual('Heading');
  });
});
