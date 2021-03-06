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
    $('#1').story_item('edit');
    $('#1 textarea').text('hello world');
    $('#sandbox').click();
    expect($('#sandbox #1 p').text()).toEqual('hello world');
  });

  it("fires element changed event after edit finished", function() {
    var changes = [];
    $('#sandbox').wikimate({
      story: [
        { "id": "1", "type": "paragraph", "text": "paragraph 1" },
        { "id": "2", "type": "paragraph", "text": "paragraph 2" }
      ],
      change: function(event, action) {
        changes.push(action);
      }
    });
    $('#2').story_item('edit');
    $('#2 textarea').text('hello world');
    $('#sandbox').click();

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
      change: function(event, action) {
        changes.push(action);
      }
    });
    $('#1').story_item('edit');
    $('#1 textarea').text('paragraph 1');
    $('#sandbox').click();
    expect(changes.length).toEqual(0);
    expect($('#sandbox #1 p').text()).toEqual('paragraph 1');
  });

  it("should save editing paragraph and create new paragraph following the paragraph when paragraph ends with 2 new lines", function() {
    $('#sandbox').wikimate({ story: [
      { "id": "1", "type": "paragraph", "text": "paragraph 1\n" },
      { "id": "2", "type": "paragraph", "text": "paragraph 2" }
    ]});
    $('#1').story_item('edit');
    Keyboard.hitEnter($('#1 textarea'));

    expect($('#1 textarea').length).toEqual(0);
    expect($('#sandbox div textarea')).toBeDefined();

    $('#sandbox div textarea').text("hello world");
    $('#sandbox').click();

    var paragraphs = $.map($('#sandbox p'), function(item) {
      return $(item).text();
    });
    expect(paragraphs).toEqual(["paragraph 1", "hello world", "paragraph 2"]);
  });

  it("should not contain last new line when paragraph is saved by user enter second new line at the end", function() {
    var changes = [];
    $('#sandbox').wikimate({ story: [
        { "id": "1", "type": "paragraph", "text": "paragraph 1\n" }
      ],
      change: function(event, action) {
        changes.push(action);
      }
    });
    $('#1').story_item('edit');
    $('#1 textarea').text("hello world\n");
    Keyboard.hitEnter($('#1 textarea'));

    expect(changes[0].item.text).toEqual("hello world\n");
  });

  it("should not save editing paragraph that only has 2 new lines inside", function() {
    var changes = [];
    $('#sandbox').wikimate({ story: [], change: function(event, action) {
      changes.push(action);
    }});
    $('#sandbox .wikimate-story').dblclick();
    Keyboard.hitEnter($('#sandbox div textarea'));
    Keyboard.hitEnter($('#sandbox div textarea'));
    expect($('#sandbox .item').length).toEqual(1);
    expect($('#sandbox .item textarea').length).toEqual(1);
    expect(changes.length).toEqual(0);
  });

  it("should fire add item change event when save a new item", function() {
    var changes = [];
    $('#sandbox').wikimate({ story: [], change: function(event, action) {
      changes.push(action);
    }});

    $('#sandbox .wikimate-story').dblclick();
    $('#sandbox div textarea').text("hello world");
    $('#sandbox').click();
    expect(changes.length).toEqual(1);

    expect(changes[0].id).toBeDefined();
    expect(changes[0].type).toEqual('add');
    expect(changes[0].item.type).toEqual(wikimate.default_story_item_type);
    expect(changes[0].item.text).toEqual('hello world');
    expect(changes[0].after).toBeUndefined();
  });

  it("should fire add item change event with 'after' attr set to prev item id", function() {
    var changes = [];
    $('#sandbox').wikimate({ story: [
        { "id": "1", "type": "paragraph", "text": "paragraph 1\n" },
        { "id": "2", "type": "paragraph", "text": "paragraph 2\n" }
      ],
      change: function(event, action) {
        changes.push(action);
      }
    });

    $('#1').story_item('edit');
    Keyboard.hitEnter($('#1 textarea'));
    $('#sandbox div textarea').text("hello world");
    $('#sandbox').click();
    expect(changes.length).toEqual(1);
    
    expect(changes[0].id).toBeDefined();
    expect(changes[0].type).toEqual('add');
    expect(changes[0].item.type).toEqual('paragraph');
    expect(changes[0].item.text).toEqual('hello world');
    expect(changes[0].after).toEqual('1');
  });

  it("should remove paragraph item when there is no content after edited", function() {
    var changes = [];
    $('#sandbox').wikimate({
      story: [{ "id": "1", "type": "paragraph", "text": "paragraph 1" }],
      change: function(event, action) {
        changes.push(action);
      }
    });

    $('#1').story_item('edit');
    $('#1 textarea').text('');
    $('#sandbox').click();

    expect(changes.length).toEqual(1);

    expect(changes[0].id).toEqual('1');
    expect(changes[0].type).toEqual('remove');
    expect(changes[0].item).toBeUndefined();
    expect($('#sandbox #1')[0]).toBeUndefined();
  });

  it("should cancel edit when user hit ESC key", function() {
    var changes = [];
    $('#sandbox').wikimate({
      story: [{ "id": "1", "type": "paragraph", "text": "paragraph 1" }],
      change: function(event, action) {
        changes.push(action);
      }
    });
    $('#1').story_item('edit');
    Keyboard.hitEsc($('#1 textarea'));
    expect(changes.length).toEqual(0);
    expect($('#sandbox #1 p').text()).toEqual('paragraph 1');
  });

  it("should cancel edit to a new item", function() {
    var changes = [];
    $('#sandbox').wikimate({
      change: function(event, action) {
        changes.push(action);
      }
    });
    $('#sandbox').wikimate('newItem').story_item('edit');
    Keyboard.hitEsc($('textarea'));
    expect(changes.length).toEqual(0);
    expect($('#sandbox .item').length).toEqual(0);
  });

  it("create new item, edit and delete it", function() {
    var changes = [];
    $('#sandbox').wikimate({ story: [], change: function(event, action) {
      changes.push(action);
    }});

    // add
    $('#sandbox .wikimate-story').dblclick();
    $('#sandbox div textarea').text("hello");
    $('#sandbox').click();

    // edit
    $('#' + changes[0].id).story_item('edit');
    $('#sandbox div textarea').text("world");
    $('#sandbox').click();

    // delete
    $('#' + changes[0].id).story_item('edit');
    $('#sandbox div textarea').text("");
    $('#sandbox').click();

    expect(changes.length).toEqual(3);
    expect(changes[0].type).toEqual('add');
    expect(changes[1].type).toEqual('edit');
    expect(changes[2].type).toEqual('remove');
  });

  it("should not fire any event when added new item and then delete it", function() {
    var changes = [];
    $('#sandbox').wikimate({ story: [], change: function(event, action) {
      changes.push(action);
    }});

    $('#sandbox .wikimate-story').dblclick();
    $('#sandbox div textarea').text("");
    $('#sandbox div textarea');
    $('#sandbox').click();
    expect(changes.length).toEqual(0);
  });

  it("should not fire edit event for \n started text", function(){
    var changes = [];
    $('#sandbox').wikimate({
      story: [{ "id": "1", "type": "paragraph", "text": "\nparagraph 1" }],
      change: function(event, action) {
        changes.push(action);
      }
    });
    $('#1').story_item('edit');
    $('#sandbox div textarea');
    $('#sandbox').click();
    expect(changes.length).toEqual(0);
  });

  it('should open editor with all text showed in viewport', function() {
    var changes = [];
    $('#sandbox').wikimate({
      story: [{ "id": "1", "type": "paragraph", "text": "a\nb\nc\nd\ne\nf\ng\nh" }],
      change: function(event, action) {
        changes.push(action);
      }
    });
    $('#1').story_item('edit');
    expect($('#1 textarea').scrollTop()).toEqual(0);
    expect($('#1 textarea').prop('scrollHeight')).toEqual($('#1 textarea').innerHeight());
  });

  it('should open editor with all text showed in viewport when paragraph text only has one long line', function() {
    var changes = [];
    $('#sandbox').wikimate({
      story: [{ "id": "1", "type": "paragraph", "text": "abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc " }],
      change: function(event, action) {
        changes.push(action);
      }
    });

    $('#1').story_item('edit');
    expect($('#1 textarea').scrollTop()).toEqual(0);
    expect($('#1 textarea').prop('scrollHeight')).toEqual($('#1 textarea').innerHeight());
  });

  it('should increase editor height when input more content', function() {
    var changes = [];
    $('#sandbox').wikimate({
      story: [{ "id": "1", "type": "paragraph", "text": "a\nb\nc" }],
      change: function(event, action) {
        changes.push(action);
      }
    });

    $('#1').story_item('edit');
    var height = $('#1 textarea').innerHeight();
    $('#1 textarea').text("a\nb\nc\nd\ne\nf\ng\nh");

    Keyboard.hitEnter($('#1 textarea'));

    expect($('#1 textarea').innerHeight()).toBeGreaterThan(height);
  });

  it("should save item when user press cmd+s after changed content", function() {
    var changes = [];
    $('#sandbox').wikimate({
      story: [{ "id": "1", "type": "paragraph", "text": "a\nb\nc" }],
      change: function(event, action) {
        changes.push(action);
      }
    });

    $('#1').story_item('edit');
    $('#1 textarea').text('hello');
    Keyboard.hitCmdS($('#1 textarea'));
    expect(changes.length).toEqual(1);
    expect(changes[0].type).toEqual('edit');
    expect(changes[0].item.text).toEqual('hello');
  });

  it("fires close event when editor is saving", function() {
    $('#sandbox').wikimate({ story: [
      { "id": "1", "type": "paragraph", "text": "paragraph 1" },
      { "id": "2", "type": "paragraph", "text": "paragraph 2" }
    ]});
    var events = [];
    $('#1').wikimate_text_editor({close: function(e) {
      events.push(e);
    }});
    $('#1 textarea').text('hello world');
    $('#sandbox').click();
    expect($('#sandbox #1 p').text()).toEqual('hello world');
    expect(events.length).toEqual(1);
    expect(events[0]).toEqual('save');
  });

  it("fires close event when editor is canceling", function() {
    $('#sandbox').wikimate({ story: [
      { "id": "1", "type": "paragraph", "text": "paragraph 1" },
      { "id": "2", "type": "paragraph", "text": "paragraph 2" }
    ]});
    var events = [];
    $('#1').wikimate_text_editor({close: function(e) {
      events.push(e);
    }});
    Keyboard.hitEsc($('#1 textarea'));
    expect($('#sandbox #1 p').text()).toEqual('paragraph 1');
    expect(events.length).toEqual(1);
    expect(events[0]).toEqual('cancel');
  });
});
