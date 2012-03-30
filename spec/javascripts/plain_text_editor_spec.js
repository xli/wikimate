describe("Plain Text Editor", function() {
  beforeEach(function() {
    $("body").append($('<div id="sandbox"></div>'));
  });
  afterEach(function() {
    $('#sandbox').remove();
  });
  it("updates text paragraph after edited", function() {
    wikimate.wiki('#sandbox').story([
      { "id": "1", "type": "paragraph", "text": "paragraph 1" },
      { "id": "2", "type": "paragraph", "text": "paragraph 2" }
    ]);
    $('#1').dblclick();
    $('#1 textarea').text('hello world');
    $('#1 textarea').focusout();
    expect($('#sandbox #1 p').text()).toEqual('hello world');
  });

  it("fires element changed event after edit finished", function() {
    var changes = [];
    $(wikimate).bind('change', function(event, action) {
      changes.push(action);
    });
    wikimate.wiki('#sandbox').story([
      { "id": "1", "type": "paragraph", "text": "paragraph 1" },
      { "id": "2", "type": "paragraph", "text": "paragraph 2" }
    ]);
    $('#2').dblclick();
    $('#2 textarea').text('hello world');
    $('#2 textarea').focusout();
    
    expect(changes.length).toEqual(1);
    expect(changes[0]).toEqual({id: '2', type: 'edit', item: { "id": "2", "type": "paragraph", "text": "hello world" }});
  });

  it("should not fire element changed event when nothing changed after edit finished", function() {
    var changes = [];
    $(wikimate).bind('change', function(event, action) {
      changes.push(action);
    });
    wikimate.wiki('#sandbox').story([
      { "id": "1", "type": "paragraph", "text": "paragraph 1" },
      { "id": "2", "type": "paragraph", "text": "paragraph 2" }
    ]);
    $('#1').dblclick();
    $('#1 textarea').text('paragraph 1');
    $('#1 textarea').focusout();
    
    expect(changes.length).toEqual(0);
    expect($('#sandbox #1 p').text()).toEqual('paragraph 1');
  });

  it("should save editing paragraph and create new paragraph following the paragraph when paragraph ends with 2 new lines", function() {
    wikimate.wiki('#sandbox').story([
      { "id": "1", "type": "paragraph", "text": "paragraph 1\n" },
      { "id": "2", "type": "paragraph", "text": "paragraph 2" }
    ]);
    $('#1').dblclick();
    Keyboard.hit($('#1 textarea'), "\n");
    expect($('#1 textarea').length).toEqual(0);
    expect($('#sandbox div textarea')).toBeDefined();
    $('#sandbox div textarea').text("hello world");
    $('#sandbox div textarea').focusout();

    var paragraphs = $.map($('#sandbox p'), function(item) {
      return $(item).text();
    });
    expect(paragraphs).toEqual(["paragraph 1\n", "hello world", "paragraph 2"])
  });
});
