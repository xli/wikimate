describe("WikiMate", function() {
  beforeEach(function() {
    d3.select("body").append('div').attr('id', 'sandbox').html('');
  });
  afterEach(function() {
    d3.select('#sandbox').remove();
  })

  it("should render text paragraphs story as wiki content", function() {
    wikimate.wiki('#sandbox').story([
      {
        "id": "1",
        "type": "paragraph",
        "text": "paragraph 1"
      },
      {
        "id": "2",
        "type": "paragraph",
        "text": "paragraph 2"
      }
    ])

    expect(d3.select('#sandbox').selectAll('p[id=paragraph-1]').text()).toEqual("paragraph 1");
    expect(d3.select('#sandbox').selectAll('p[id=paragraph-2]').text()).toEqual("paragraph 2");
  });
});