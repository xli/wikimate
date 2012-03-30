describe("Paragraph Element", function() {
  beforeEach(function() {
    $("body").append($('<div id="sandbox"></div>'));
  });
  afterEach(function() {
    $('#sandbox').remove();
  })

  it("opens plain textarea editor for text paragraph by double click", function() {
    wikimate.wiki('#sandbox').story([
      { "id": "1", "type": "paragraph", "text": "paragraph 1" },
      { "id": "2", "type": "paragraph", "text": "paragraph 2" }
    ]);
    $('#1').dblclick();
    expect($('#sandbox textarea').text()).toEqual("paragraph 1");
  });

});
