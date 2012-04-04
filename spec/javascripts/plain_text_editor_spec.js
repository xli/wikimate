describe("Plain Text Editor", function() {
  beforeEach(function() {
    $("body").append($('<div id="sandbox"></div>'));
  });
  afterEach(function() {
    $('#sandbox').remove();
  });
  it("updates text paragraph after edited", function() {
    $('#sandbox').wikimate({ story: [
      { "id": "1", "type": "paragraph", "text": "paragraph 1" },
      { "id": "2", "type": "paragraph", "text": "paragraph 2" }
    ]});
    $('#1').dblclick();
    $('#1 textarea').text('hello world').focusout();
    expect($('#sandbox #1 p').text()).toEqual('hello world');
  });

  it("fires element changed event after edit finished", function() {
    var changes = [];
    $('#sandbox').wikimate({
      story: [
        { "id": "1", "type": "paragraph", "text": "paragraph 1" },
        { "id": "2", "type": "paragraph", "text": "paragraph 2" }
      ],
      change: function(event, action) { changes.push(action); }
    });
    $('#2').dblclick();
    $('#2 textarea').text('hello world').focusout();
    
    expect(changes.length).toEqual(1);
    expect(changes[0]).toEqual({id: '2', type: 'edit', item: { "id": "2", "type": "paragraph", "text": "hello world" }});
  });

  it("should not fire element changed event when nothing changed after edit finished", function() {
    var changes = [];
    $('#sandbox').wikimate({
      story: [
        { "id": "1", "type": "paragraph", "text": "paragraph 1" },
        { "id": "2", "type": "paragraph", "text": "paragraph 2" }
      ],
      change: function(event, action) { changes.push(action); }
    });
    $('#1').dblclick();
    $('#1 textarea').text('paragraph 1').focusout();
    expect(changes.length).toEqual(0);
    expect($('#sandbox #1 p').text()).toEqual('paragraph 1');
  });

  it("should save editing paragraph and create new paragraph following the paragraph when paragraph ends with 2 new lines", function() {
    $('#sandbox').wikimate({ story: [
      { "id": "1", "type": "paragraph", "text": "paragraph 1\n" },
      { "id": "2", "type": "paragraph", "text": "paragraph 2" }
    ]});
    $('#1').dblclick();
    Keyboard.hitEnter($('#1 textarea'));

    expect($('#1 textarea').length).toEqual(0);
    expect($('#sandbox div textarea')).toBeDefined();

    $('#sandbox div textarea').text("hello world").focusout();

    var paragraphs = $.map($('#sandbox p'), function(item) {
      return $(item).text();
    });
    expect(paragraphs).toEqual(["paragraph 1", "hello world", "paragraph 2"])
  });

  it("should not save editing paragraph that only has 2 new lines inside", function() {
    var changes = [];
    $('#sandbox').wikimate({ story: [], change: function(event, action) { changes.push(action) }});
    $('#sandbox').dblclick();
    Keyboard.hitEnter($('#sandbox div textarea'));
    Keyboard.hitEnter($('#sandbox div textarea'));
    expect($('#sandbox div').length).toEqual(1);
    expect($('#sandbox div textarea').length).toEqual(1);
    expect(changes.length).toEqual(0);
  });

  it("should fire add item change event when save a new item", function() {
    var changes = [];
    $('#sandbox').wikimate({ story: [], change: function(event, action) { changes.push(action) }});

    $('#sandbox').dblclick();
    $('#sandbox div textarea').text("hello world").focusout();
    expect(changes.length).toEqual(1);

    expect(changes[0]['id']).toBeDefined();
    expect(changes[0]['type']).toEqual('add');
    expect(changes[0]['item']['type']).toEqual('paragraph');
    expect(changes[0]['item']['text']).toEqual('hello world');
    expect(changes[0]['after']).toBeUndefined();
  });

  it("should remove paragraph item when there is content after edited", function() {
    var changes = [];
    $('#sandbox').wikimate({
      story: [{ "id": "1", "type": "paragraph", "text": "paragraph 1" }],
      change: function(event, action) { changes.push(action) }
    });

    $('#1').dblclick();
    $('#1 textarea').text('').focusout();

    expect(changes.length).toEqual(1);

    expect(changes[0]['id']).toEqual('1');
    expect(changes[0]['type']).toEqual('remove');
    expect(changes[0]['item']['id']).toEqual('1');
    expect(changes[0]['item']['type']).toEqual('paragraph');
    expect(changes[0]['item']['text']).toEqual('paragraph 1');
    expect($('#sandbox #1')[0]).toBeUndefined();
  });

  it("should cancel edit when user hit ESC key", function() {
    var changes = [];
    $('#sandbox').wikimate({
      story: [{ "id": "1", "type": "paragraph", "text": "paragraph 1" }],
      change: function(event, action) { changes.push(action) }
    });
    $('#1').dblclick();
    Keyboard.hitEsc($('#1 textarea'));
    expect(changes.length).toEqual(0);
    expect($('#sandbox #1 p').text()).toEqual('paragraph 1');
  });

  it("create new item, edit and delete it", function() {
    var changes = [];
    $('#sandbox').wikimate({ story: [], change: function(event, action) { changes.push(action) }});

    // add
    $('#sandbox').dblclick();
    $('#sandbox div textarea').text("hello").focusout();

    // edit
    $('#' + changes[0].id).dblclick();
    $('#sandbox div textarea').text("world").focusout();

    // delete
    $('#' + changes[0].id).dblclick();
    $('#sandbox div textarea').text("").focusout();

    expect(changes.length).toEqual(3);
    expect(changes[0].type).toEqual('add');
    expect(changes[1].type).toEqual('edit');
    expect(changes[2].type).toEqual('remove');
  });

  it("should not fire any event when added new item and then delete it", function() {
    var changes = [];
    $('#sandbox').wikimate({ story: [], change: function(event, action) { changes.push(action) }});

    $('#sandbox').dblclick();
    $('#sandbox div textarea').text("");
    $('#sandbox div textarea').focusout();
    expect(changes.length).toEqual(0);
  });

  it("should not fire edit event for \n started text", function(){
    var changes = [];
    $('#sandbox').wikimate({
      story: [{ "id": "1", "type": "paragraph", "text": "\nparagraph 1" }],
      change: function(event, action) { changes.push(action) }
    });
    $('#1').dblclick();
    $('#sandbox div textarea').focusout();
    expect(changes.length).toEqual(0);
  });
});
