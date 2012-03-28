describe("WikiMate", function() {
  beforeEach(function() {
    d3.select("body").append('div').attr('id', 'sandbox');
  });
  afterEach(function() {
    d3.select('#sandbox').remove();
  })

  it("should render text paragraphs story as wiki content", function() {
    wikimate.wiki('#sandbox').story([
      { "id": "1", "type": "paragraph", "text": "paragraph 1" },
      { "id": "2", "type": "paragraph", "text": "paragraph 2" }
    ]);

    var paragraphs = $.map($('#sandbox p'), function(item) {
      return $(item).text();
    });
    expect(paragraphs).toEqual(["paragraph 1", 'paragraph 2']);
  });

  it("should inline edit text paragraph by double click", function() {
    wikimate.wiki('#sandbox').story([
      { "id": "1", "type": "paragraph", "text": "paragraph 1" },
      { "id": "2", "type": "paragraph", "text": "paragraph 2" }
    ]);
    $('#1').dblclick();
    expect($('#sandbox textarea').text()).toEqual("paragraph 1");
  });

  it("should render text paragraph after clicked outside of editor", function() {
    wikimate.wiki('#sandbox').story([
      { "id": "1", "type": "paragraph", "text": "paragraph 1" },
      { "id": "2", "type": "paragraph", "text": "paragraph 2" }
    ]);
    $('#1').dblclick();
    $('#1 textarea').focusout();
    expect($('#sandbox #1 p').text()).toEqual('paragraph 1');
  });

  it("should render updated text paragraph", function() {
    wikimate.wiki('#sandbox').story([
      { "id": "1", "type": "paragraph", "text": "paragraph 1" },
      { "id": "2", "type": "paragraph", "text": "paragraph 2" }
    ]);
    $('#1').dblclick();
    $('#1 textarea').text('hello world');
    $('#1 textarea').focusout();
    expect($('#sandbox #1 p').text()).toEqual('hello world');
  });

  it("should fire element changed event after edit finished", function() {
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
});
