describe("WikiMate", function() {
  beforeEach(function() {
    $("body").append($('<div id="sandbox"></div>'));
  });
  afterEach(function() {
    $('#sandbox').remove();
  })

  it("renders text paragraphs story", function() {
    wikimate.wiki('#sandbox').story([
      { "id": "1", "type": "paragraph", "text": "paragraph 1" },
      { "id": "2", "type": "paragraph", "text": "paragraph 2" },
      { "id": "3", "type": "paragraph", "text": "paragraph 3" }
    ]);

    var paragraphs = $.map($('#sandbox p'), function(item) {
      return $(item).text();
    });
    expect(paragraphs).toEqual(["paragraph 1", 'paragraph 2', 'paragraph 3']);
  });

});
