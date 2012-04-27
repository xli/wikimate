describe("Factory", function() {
  beforeEach(function() {
    $("body").append($('<div id="sandbox"></div>'));
  });
  afterEach(function() {
    $('#sandbox').remove();
  });

  it("add a factory element for creating plugin item", function() {
    $('#sandbox').wikimate({});
    $('#sandbox').wikimate('newItem', {type: 'factory'});
    expect($('.item').hasClass('factory')).toEqual(true);
    expect($('.item').story_item('data').text).toEqual('');

    var result = _.map($('.item .new-plugin-item-link'), function(link) {
      return link.text;
    });
    expect(result.sort()).toEqual(['Rich Document', 'Todo list'].sort());
  });

  it("new plugin item and enter edit mode when click the title listed", function() {
    $('#sandbox').wikimate({});
    $('#sandbox').wikimate('newItem', {type: 'factory'});
    $('.new-todo').click();
  
    expect($('#sandbox .item').prop('class')).toEqual('item todo');
    expect($('#sandbox .item textarea').length).toEqual(1);
    expect($('#sandbox .item').story_item('data').type).toEqual('todo');
    expect($('#sandbox .item').story_item('data').text).toEqual('');
  });

  it("new plugin item and enter edit mode with one action change", function() {
    var changes = [];
    $('#sandbox').wikimate({change: function(e, action) {
      changes.push(action);
    }});
    $('#sandbox').wikimate('newItem', {type: 'factory'});
    $('.new-todo').click();
    expect(changes.length).toEqual(0);
    $('#sandbox .item textarea').text("hello").focusout();
    expect(changes.length).toEqual(1);
    expect(changes[0].type).toEqual('add');
  });

  it("edit factory element will change element to a paragraph item", function() {
    $('#sandbox').wikimate({});
    $('#sandbox').wikimate('newItem', {type: 'factory'}).story_item('edit');

    expect($('#sandbox .item').prop('class')).toEqual('item paragraph');
    expect($('#sandbox .item').data('data').type).toEqual('paragraph');
    expect($('#sandbox .item textarea').text()).toEqual("");
  });
});
