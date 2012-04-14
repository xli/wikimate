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
    $('#1').click();
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
    $('#2').click();
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
    $('#1').click();
    $('#1 textarea').text('paragraph 1').focusout();
    expect(changes.length).toEqual(0);
    expect($('#sandbox #1 p').text()).toEqual('paragraph 1');
  });

  it("should save editing paragraph and create new paragraph following the paragraph when paragraph ends with 2 new lines", function() {
    $('#sandbox').wikimate({ story: [
      { "id": "1", "type": "paragraph", "text": "paragraph 1\n" },
      { "id": "2", "type": "paragraph", "text": "paragraph 2" }
    ]});
    $('#1').click();
    Keyboard.hitEnter($('#1 textarea'));

    expect($('#1 textarea').length).toEqual(0);
    expect($('#sandbox div textarea')).toBeDefined();

    $('#sandbox div textarea').text("hello world").focusout();

    var paragraphs = $.map($('#sandbox p'), function(item) {
      return $(item).text();
    });
    expect(paragraphs).toEqual(["paragraph 1", "hello world", "paragraph 2"])
  });

  it("should not contain last new line when paragraph is saved by user enter second new line at the end", function() {
    var changes = [];
    $('#sandbox').wikimate({ story: [
      { "id": "1", "type": "paragraph", "text": "paragraph 1\n" }
    ], change: function(event, action) { changes.push(action) }});
    $('#1').click()
    $('#1 textarea').text("hello world\n");
    Keyboard.hitEnter($('#1 textarea'));

    expect(changes[0].item.text).toEqual("hello world\n");
  });

  it("should not save editing paragraph that only has 2 new lines inside", function() {
    var changes = [];
    $('#sandbox').wikimate({ story: [], change: function(event, action) { changes.push(action) }});
    $('#sandbox .wikimate-panel').dblclick();
    Keyboard.hitEnter($('#sandbox div textarea'));
    Keyboard.hitEnter($('#sandbox div textarea'));
    expect($('#sandbox .item').length).toEqual(1);
    expect($('#sandbox .item textarea').length).toEqual(1);
    expect(changes.length).toEqual(0);
  });

  it("should fire add item change event when save a new item", function() {
    var changes = [];
    $('#sandbox').wikimate({ story: [], change: function(event, action) { changes.push(action) }});

    $('#sandbox .wikimate-panel').dblclick();
    $('#sandbox div textarea').text("hello world").focusout();
    expect(changes.length).toEqual(1);

    expect(changes[0]['id']).toBeDefined();
    expect(changes[0]['type']).toEqual('add');
    expect(changes[0]['item']['type']).toEqual('paragraph');
    expect(changes[0]['item']['text']).toEqual('hello world');
    expect(changes[0]['after']).toBeUndefined();
  });

  it("should fire add item change event with 'after' attr set to prev item id", function() {
    var changes = [];
    $('#sandbox').wikimate({ story: [
        { "id": "1", "type": "paragraph", "text": "paragraph 1\n" },
        { "id": "2", "type": "paragraph", "text": "paragraph 2\n" }
      ], change: function(event, action) { changes.push(action) }
    });

    $('#1').click();
    Keyboard.hitEnter($('#1 textarea'));
    $('#sandbox div textarea').text("hello world").focusout();
    expect(changes.length).toEqual(1);
    
    expect(changes[0]['id']).toBeDefined();
    expect(changes[0]['type']).toEqual('add');
    expect(changes[0]['item']['type']).toEqual('paragraph');
    expect(changes[0]['item']['text']).toEqual('hello world');
    expect(changes[0]['after']).toEqual('1');
  });

  it("should remove paragraph item when there is content after edited", function() {
    var changes = [];
    $('#sandbox').wikimate({
      story: [{ "id": "1", "type": "paragraph", "text": "paragraph 1" }],
      change: function(event, action) { changes.push(action) }
    });

    $('#1').click();
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
    $('#1').click();
    Keyboard.hitEsc($('#1 textarea'));
    expect(changes.length).toEqual(0);
    expect($('#sandbox #1 p').text()).toEqual('paragraph 1');
  });

  it("create new item, edit and delete it", function() {
    var changes = [];
    $('#sandbox').wikimate({ story: [], change: function(event, action) { changes.push(action) }});

    // add
    $('#sandbox .wikimate-panel').dblclick();
    $('#sandbox div textarea').text("hello").focusout();

    // edit
    $('#' + changes[0].id).click();
    $('#sandbox div textarea').text("world").focusout();

    // delete
    $('#' + changes[0].id).click();
    $('#sandbox div textarea').text("").focusout();

    expect(changes.length).toEqual(3);
    expect(changes[0].type).toEqual('add');
    expect(changes[1].type).toEqual('edit');
    expect(changes[2].type).toEqual('remove');
  });

  it("should not fire any event when added new item and then delete it", function() {
    var changes = [];
    $('#sandbox').wikimate({ story: [], change: function(event, action) { changes.push(action) }});

    $('#sandbox .wikimate-panel').dblclick();
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
    $('#1').click();
    $('#sandbox div textarea').focusout();
    expect(changes.length).toEqual(0);
  });

  it('should open editor with all text showed in viewport', function() {
    var changes = [];
    $('#sandbox').wikimate({
      story: [{ "id": "1", "type": "paragraph", "text": "a\nb\nc\nd\ne\nf\ng\nh" }],
      change: function(event, action) { changes.push(action) }
    });
    $('#1').click();
    expect($('#1 textarea').scrollTop()).toEqual(0);
    expect($('#1 textarea').prop('scrollHeight')).toEqual($('#1 textarea').innerHeight());
  });

  it('should open editor with all text showed in viewport when paragraph text only has one long line', function() {
    var changes = [];
    $('#sandbox').wikimate({
      story: [{ "id": "1", "type": "paragraph", "text": "abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc " }],
      change: function(event, action) { changes.push(action) }
    });

    $('#1').click();
    expect($('#1 textarea').scrollTop()).toEqual(0);
    expect($('#1 textarea').prop('scrollHeight')).toEqual($('#1 textarea').innerHeight());
  });

  it('should increase editor height when input more content', function() {
    var changes = [];
    $('#sandbox').wikimate({
      story: [{ "id": "1", "type": "paragraph", "text": "a\nb\nc" }],
      change: function(event, action) { changes.push(action) }
    });

    $('#1').click();
    var height = $('#1 textarea').innerHeight();
    $('#1 textarea').text("a\nb\nc\nd\ne\nf\ng\nh");

    Keyboard.hitEnter($('#1 textarea'));

    expect($('#1 textarea').innerHeight()).toBeGreaterThan(height);
  });

  it("should save item when user press cmd+s after changed content", function() {
    var changes = [];
    $('#sandbox').wikimate({
      story: [{ "id": "1", "type": "paragraph", "text": "a\nb\nc" }],
      change: function(event, action) { changes.push(action) }
    });

    $('#1').click();
    $('#1 textarea').text('hello')
    Keyboard.hitCmdS($('#1 textarea'));
    expect(changes.length).toEqual(1);
    expect(changes[0].type).toEqual('edit');
    expect(changes[0].item.text).toEqual('hello');
  });
  // remove icon is too close to drag&drop icon when the paragraph is just one line height
  // it('should show remove item link for deleting item when hover the item div', function() {
  //   var changes = [];
  //   $('#sandbox').wikimate({
  //     story: [{ "id": "1", "type": "paragraph", "text": "a\nb\nc" }],
  //     change: function(event, action) { changes.push(action) }
  //   });
  // 
  //   expect($('#1 a:visible').length).toEqual(0);
  //   $('#1 .item-content').mouseover();
  //   expect($('#1 a:visible').length).toEqual(1);
  //   $('#1 a').click();
  // 
  //   expect($('#1').length).toEqual(0);
  //   expect(changes.length).toEqual(1);
  //   expect(changes[0].type).toEqual('remove');
  // });
});
