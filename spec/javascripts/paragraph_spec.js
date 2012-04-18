describe("Paragraph Element", function() {
  beforeEach(function() {
    $("body").append($('<div id="sandbox"></div>'));
  });
  afterEach(function() {
    $('#sandbox').remove();
  })

  it("opens plain textarea editor for text paragraph by double click", function() {
    $('#sandbox').wikimate({ story: [
      { "id": "1", "type": "paragraph", "text": "paragraph 1" },
      { "id": "2", "type": "paragraph", "text": "paragraph 2" }
    ]});
    $('#1 .item-content').click();
    expect($('#sandbox textarea').text()).toEqual("paragraph 1");
  });

  it("renders multi lines text as multi p elements", function() {
    $('#sandbox').wikimate({ story: [
      { "id": "1", "type": "paragraph", "text": "p 1 \n p 2 \n p 3" },
    ]});
    var paragraphs = $.map($('#sandbox #1 p'), function(item) {
      return $(item).text();
    });
    expect(paragraphs).toEqual(['p 1 ', ' p 2 ', ' p 3']);
  });
});
