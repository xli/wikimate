describe("Story", function() {
  beforeEach(function() {
    $("body").append($('<div id="sandbox"></div>'));
  });
  afterEach(function() {
    $('#sandbox').remove();
  });

  describe("editable status", function() {
    it("saving item", function() {
      $('#sandbox').wikimate({ story: [
        { "id": "1", "type": "paragraph", "text": "paragraph 1" },
        { "id": "2", "type": "paragraph", "text": "paragraph 2" }
      ]});
      $('#1').story_item('edit');
      $('#1 textarea').text('hello world');
      $('#sandbox').click();
      expect($('#1').story_item('editable')).toEqual(false);
      expect($('#2').story_item('editable')).toEqual(false);
    });

    it("add the item when text is not empty but same with default", function() {
      var changes = [];
      $('#sandbox').wikimate({change: function(event, action) {
        changes.push(action);
      }});
      $('#sandbox').wikimate('newItem', {type: 'todo'}).story_item('edit');
      $('.item textarea');
      $('#sandbox').click();
      expect(changes.length).toEqual(1);
      expect($('#sandbox').wikimate('story').length).toEqual(1);
    });

    it("deleting item", function() {
      $('#sandbox').wikimate({ story: [
        { "id": "1", "type": "paragraph", "text": "paragraph 1" },
        { "id": "2", "type": "paragraph", "text": "paragraph 2" }
      ]});
      $('#1').story_item('edit');
      $('#1 textarea').text('');
      $('#sandbox').click();
      expect($('#1').story_item('editable')).toEqual(false);
      expect($('#2').story_item('editable')).toEqual(false);
    });

    it("is canceling editing item", function() {
      $('#sandbox').wikimate({ story: [
        { "id": "1", "type": "paragraph", "text": "paragraph 1" },
        { "id": "2", "type": "paragraph", "text": "paragraph 2" }
      ]});
      $('#1').story_item('edit');
      $('#1 textarea').text('paragraph 1');
      $('#sandbox').click();
      expect($('#1').story_item('editable')).toEqual(false);
      expect($('#2').story_item('editable')).toEqual(false);
    });
  });

  it("new item by given data", function() {
    $('#sandbox').wikimate({ story: []});
    $('#sandbox').wikimate('newItem', {text: 'hello'});
    expect($('.item').length).toEqual(1);
    expect($('.item p').text()).toEqual('hello');
    expect($('.item').story_item('data').text).toEqual('hello');
  });

  it("add item after given item id", function() {
    $('#sandbox').wikimate({ story: [
      { "id": "1", "type": "paragraph", "text": "paragraph 1" },
      { "id": "2", "type": "paragraph", "text": "paragraph 2" }
    ]});

    var item = $('#sandbox').wikimate('newItem', {text: 'hello'}, {after: '1'}).story_item('edit');
    item.find('textarea');
    $('#sandbox').click();

    var items = $.map($('#sandbox .item'), function(item) {
      return $(item).text();
    });
    expect(items).toEqual(['paragraph 1', 'hello', 'paragraph 2']);
  });

  it("add item inside given item id", function() {
    $('#sandbox').wikimate({ story: [
      { "id": "1", "type": "one_column_layout", "text": "heading", 'story': [] },
      { "id": "2", "type": "paragraph", "text": "paragraph 2" }
    ]});

    var item = $('#sandbox').wikimate('newItem', {text: ''}, {inside: '1'}).story_item('edit');
    item.find('textarea').text("hello");
    $('#sandbox').click();

    var items = $('#sandbox').wikimate('story');
    expect(items.length).toEqual(2);
    expect(items[0].story.length).toEqual(1);
    expect(items[0].story[0].text).toEqual('hello');
    expect(items[1]).toEqual({ "id": "2", "type": "paragraph", "text": "paragraph 2" });
  });

  it("has a [+] link to add new item", function() {
    $('#sandbox').wikimate({ story: [
      { "id": "1", "type": "one_column_layout", "text": "heading", 'story': [] },
      { "id": "2", "type": "paragraph", "text": "paragraph 2" }
    ]});
    expect($('#sandbox > .add-new-factory')[0]).toBeDefined();
    $('#sandbox > .add-new-factory').click();
    expect($('#sandbox > .wikimate-story > .item').length).toEqual(3);
    expect($('#sandbox > .wikimate-story > .factory')[0]).toBeDefined();
  });

  it("has a [+] link to add new item in layout item", function() {
    $('#sandbox').wikimate({ story: [
      { "id": "1", "type": "one_column_layout", "text": "heading", 'story': [] },
      { "id": "2", "type": "paragraph", "text": "paragraph 2" }
    ]});
    expect($('#sandbox .one_column_layout .add-new-factory')[0]).toBeDefined();
    $('#sandbox .one_column_layout .add-new-factory').click();
    expect($('#sandbox .one_column_layout .item').length).toEqual(1);
    expect($('#sandbox .one_column_layout .factory')[0]).toBeDefined();
  });

  it("save editing item when click element out side of editing item", function() {
    $('#sandbox').wikimate({ story: [
      { "id": "1", "type": "one_column_layout", "text": "heading", 'story': [] },
      { "id": "2", "type": "paragraph", "text": "paragraph 2" }
    ]});
    $('#2').story_item('edit');
    $('#2 textarea').text("hello");
    $('#1').click();
    expect($('#sandbox #2 p').text()).toEqual('hello');
  });

  describe("Story Item", function() {
    it("updates existing data by changed attributes", function() {
      $('#sandbox').wikimate({ story: []});
      $('#sandbox').wikimate('newItem', {text: 'hello', type: 'todo'});
      $('.item').story_item('update', {text: 'world'});
      var data = $('.item').story_item('data');
      expect(data.type).toEqual('todo');
      expect(data.text).toEqual('world');
    });
  });
});
