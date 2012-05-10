describe("WikiMate", function() {
  beforeEach(function() {
    $("body").append($('<div id="sandbox"></div>'));
  });
  afterEach(function() {
    $('#sandbox').remove();
    wikimate.default_story_item_type = 'paragraph';
  });

  it("renders text paragraphs story", function() {
    $('#sandbox').wikimate({ story: [
      { "id": "1", "type": "paragraph", "text": "paragraph 1" },
      { "id": "2", "type": "paragraph", "text": "paragraph 2" },
      { "id": "3", "type": "paragraph", "text": "paragraph 3" }
    ]});

    var paragraphs = $.map($('#sandbox p'), function(item) {
      return $(item).text();
    });
    expect(paragraphs).toEqual(["paragraph 1", 'paragraph 2', 'paragraph 3']);
  });

  it("should be able to dbclick anywhere in panel to create new text paragraph item", function() {
    $('#sandbox').wikimate({}).find('.wikimate-story').dblclick();
    expect($('#sandbox .item').length).toEqual(1);
    expect($('#sandbox .item textarea').length).toEqual(1);
  });

  it("should bind item data with div element", function() {
    $('#sandbox').wikimate({ story: [
      { "id": "1", "type": "paragraph", "text": "paragraph 1" }
    ]});
    expect($('#1').data('data')).toBeDefined();
  });

  it("change default story item type", function() {
    wikimate.default_story_item_type = 'todo';
    $('#sandbox').wikimate({}).find('.wikimate-story').dblclick();
    expect($('#sandbox .item').length).toEqual(1);
    expect($('#sandbox .item').story_item('data').type).toEqual('todo');

    $('#sandbox').wikimate('newItem', {type: 'factory'});
    $('.factory').click();
    expect($('#sandbox .item').prop('class')).toEqual('item todo');
  });

  it("new paragraph with text", function() {
    $('#sandbox').wikimate({}).wikimate('newItem', {type: 'paragraph', text: 'hello world'}).story_item('save');
    expect($('#sandbox .item p').text()).toEqual('hello world');
  });
});
