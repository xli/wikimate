describe("Story", function() {
  beforeEach(function() {
    $("body").append($('<div id="sandbox"></div>'));
  });
  afterEach(function() {
    $('#sandbox').remove();
  });

  describe("editable status", function() {
    it("saving item", function() {
      $('#sandbox').wikimate({ story: [
        { "id": "1", "type": "paragraph", "text": "paragraph 1" },
        { "id": "2", "type": "paragraph", "text": "paragraph 2" }
      ]});
      $('#1').story_item('edit');
      $('#1 textarea').text('hello world').focusout();
      expect($('#1').story_item('editable')).toEqual(false);
      expect($('#2').story_item('editable')).toEqual(false);
    });

    it("deleting item", function() {
      $('#sandbox').wikimate({ story: [
        { "id": "1", "type": "paragraph", "text": "paragraph 1" },
        { "id": "2", "type": "paragraph", "text": "paragraph 2" }
      ]});
      $('#1').story_item('edit');
      $('#1 textarea').text('').focusout();
      expect($('#1').story_item('editable')).toEqual(false);
      expect($('#2').story_item('editable')).toEqual(false);
    });

    it("is canceling editing item", function() {
      $('#sandbox').wikimate({ story: [
        { "id": "1", "type": "paragraph", "text": "paragraph 1" },
        { "id": "2", "type": "paragraph", "text": "paragraph 2" }
      ]});
      $('#1').story_item('edit');
      $('#1 textarea').text('paragraph 1').focusout();
      expect($('#1').story_item('editable')).toEqual(false);
      expect($('#2').story_item('editable')).toEqual(false);
    });
  });

  it("new item by given data", function() {
    $('#sandbox').wikimate({ story: []});
    $('#sandbox').wikimate('newItem', {text: 'hello'});
    expect($('.item').length).toEqual(1);
    expect($('.item textarea').text()).toEqual('hello');
    $('.item').story_item('save');
    expect($('.item').story_item('data').text).toEqual('hello');
  });

});
