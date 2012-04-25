describe("WikiMate", function() {
  beforeEach(function() {
    $("body").append($('<div id="sandbox"></div>'));
  });
  afterEach(function() {
    $('#sandbox').remove();
  });

  it("renders text paragraphs story", function() {
    $('#sandbox').wikimate({ story: [
      { "id": "1", "type": "paragraph", "text": "paragraph 1" },
      { "id": "2", "type": "paragraph", "text": "paragraph 2" },
      { "id": "3", "type": "paragraph", "text": "paragraph 3" }
    ]});

    var paragraphs = $.map($('#sandbox p'), function(item) {
      return $(item).text();
    });
    expect(paragraphs).toEqual(["paragraph 1", 'paragraph 2', 'paragraph 3']);
  });

  it("should be able to dbclick anywhere in panel to create new text paragraph item", function() {
    $('#sandbox').wikimate({}).find('.wikimate-story').dblclick();
    expect($('#sandbox .item').length).toEqual(1);
    expect($('#sandbox .item textarea').length).toEqual(1);
  });

  it("should bind item data with div element", function() {
    $('#sandbox').wikimate({ story: [
      { "id": "1", "type": "paragraph", "text": "paragraph 1" }
    ]});
    expect($('#1').data('data')).toBeDefined();
  });

  it("add a factory element for creating plugin item", function() {
    $('#sandbox').wikimate({});
    $('#sandbox').wikimate('newItem', {type: 'factory'});
    expect($('.item').hasClass('factory')).toEqual(true);

    var result = _.map($('.item a'), function(link) {
      return link.text;
    });
    expect(result.sort()).toEqual(['Add a paragraph', 'Ad a rich document']);
  });
});
