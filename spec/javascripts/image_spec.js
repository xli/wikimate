describe("Image", function() {
  beforeEach(function() {
    $("body").append($('<div id="sandbox"></div>'));
  });
  afterEach(function() {
    $('#sandbox').remove();
    $('.ui-dialog').remove();
  });

  it("add image into item content by factory", function() {
    $('#sandbox').wikimate({});
    $('#sandbox').wikimate('newItem', {type: 'factory'});
    $('.new-image').click();
    var image = "data:image/gif;base64,R0lGODlhEAAOALMAAOazToeHh0tLS/7LZv/0jvb29t/f3//Ub//ge8WSLf/rhf/3kdbW1mxsbP//mf///yH5BAAAAAAALAAAAAAQAA4AAARe8L1Ekyky67QZ1hLnjM5UUde0ECwLJoExKcppV0aCcGCmTIHEIUEqjgaORCMxIC6e0CcguWw6aFjsVMkkIr7g77ZKPJjPZqIyd7sJAgVGoEGv2xsBxqNgYPj/gAwXEQA7";
    $('.image_url_input').val(image);
    var done = $('.ui-button').filter(function(i, button) {
      return $(button).text() == "Done";
    });
    done.click();

    expect($('#sandbox .item').prop('class')).toEqual('item image');
    expect($('#sandbox .item img').length).toEqual(1);
    expect($('#sandbox .item img').prop('src')).toEqual(image);
    expect($('#sandbox .item').story_item('data').type).toEqual('image');
    expect($('#sandbox .item').story_item('data').text).toEqual(image);
  });

  it("should not add image when image url is blank", function() {
    $('#sandbox').wikimate({});
    $('#sandbox').wikimate('newItem', {type: 'factory'});
    $('.new-image').click();
    var done = $('.ui-button').filter(function(i, button) {
      return $(button).text() == "Done";
    });

    done.click();

    expect($('#sandbox .item').length).toEqual(0);
  });
});
