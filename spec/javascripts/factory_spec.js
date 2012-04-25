describe("Factory", function() {
  beforeEach(function() {
    $("body").append($('<div id="sandbox"></div>'));
  });
  afterEach(function() {
    $('#sandbox').remove();
  });

  it("add a factory element for creating plugin item", function() {
    $('#sandbox').wikimate({});
    $('#sandbox').wikimate('newItem', {type: 'factory'});
    expect($('.item').hasClass('factory')).toEqual(true);
    expect($('.item').story_item('data').text).toEqual('');

    var result = _.map($('.item .new-plugin-item-link'), function(link) {
      return link.text;
    });
    expect(result.sort()).toEqual(['Rich Document'].sort());
  });

  // todo, create another simple plugin to test this
  // it("new plugin item when click the title listed", function() {
  //   $('#sandbox').wikimate({});
  //   $('#sandbox').wikimate('newItem', {type: 'factory'});
  //   $('.new-paragraph').click();
  // 
  //   expect($('#sandbox .item').prop('class')).toEqual('item paragraph');
  //   expect($('#sandbox .item textarea').length).toEqual(1);
  //   expect($('#sandbox .item').story_item('data').type).toEqual('paragraph');
  //   expect($('#sandbox .item').story_item('data').text).toEqual('');
  // });

  it("edit factory element will change element to a paragraph item", function() {
    $('#sandbox').wikimate({});
    $('#sandbox').wikimate('newItem', {type: 'factory'}).story_item('edit');

    expect($('#sandbox .item').prop('class')).toEqual('item paragraph');
    expect($('#sandbox .item').data('data').type).toEqual('paragraph');
    expect($('#sandbox .item textarea').text()).toEqual("");
  });
});
