describe("Factory", function() {
  beforeEach(function() {
    $("body").append($('<div id="sandbox"></div>'));
  });
  afterEach(function() {
    if (tinymce.activeEditor) {
      tinymce.activeEditor.remove();
    }
    $('#sandbox').remove();
  });

  it("open rich document editor", function() {
    runs(function() {
      $('#sandbox').wikimate({ story: []});
      $('#sandbox').wikimate('newItem', {text: 'hello', type: 'rdoc'});
    });
    waits(150);
    runs(function() {
      expect($('.item').length).toEqual(1);
      expect($('.item .mceEditor').length).toEqual(1);
    });
  });

  it("new rich document item after clicked Rich Document link in factory item", function() {
    runs(function() {
      $('#sandbox').wikimate({});
      $('#sandbox').wikimate('newItem', {type: 'factory'});
      $('.new-rdoc').click();
    });

    // auto focus of the editor need 100 ms
    waits(150);
    runs(function() {
      expect($('#sandbox .item').prop('class')).toEqual('item rdoc');
      expect($('#sandbox .item textarea').css('display')).toEqual('none');
      expect($('#sandbox .item .mceEditor').length).toEqual(1);
      expect($('#sandbox .item').story_item('data').type).toEqual('rdoc');
      expect($('#sandbox .item').story_item('data').text).toEqual('');
    });
  });
});
