describe("Markdown", function() {
  beforeEach(function() {
    $("body").append($('<div id="sandbox"></div>'));
  });
  afterEach(function() {
    $('#sandbox').remove();
  });

  it("render markdown", function() {
    $('#sandbox').wikimate({ story: [
      {id: '1', type: 'markdown', text: "h1 text\n=======\nhello world"}
    ]});
    expect($('#1 .item-content').html()).toEqual('<h1 id="h1text">h1 text</h1>\n\n<p>hello world</p>');
  });

  it("opens plain textarea editor for editing by double click", function() {
    $('#sandbox').wikimate({ story: [
      { "id": "1", "type": "markdown", "text": "paragraph 1" },
      { "id": "2", "type": "markdown", "text": "paragraph 2" }
    ]});
    $('#1').story_item('edit');
    expect($('#sandbox textarea').text()).toEqual("paragraph 1");
  });
});
