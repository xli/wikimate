function view(title, codeText) {
  var code = $('<pre/>').text(codeText);
  $('<div/>').append(code).dialog({
    title: title,
    model: true,
    width: '90%'
  })
}

$(document).ready(function() {
  $('#undo').click(function(e) {
    $('#wiki').wikimate('undo');
  });
  $('#view_source').click(function(e) {
    $.ajax({
      url: 'javascripts/main.js',
      dataType: 'script',
      success: function(r) {
        view("Source Code to initialize the editor", r);
      }
    })
  });
  $('#view_story').click(function(e) {
    view("Story: $('#wiki').wikimate('story')", JSON.stringify($('#wiki').wikimate('story'), null, 2));
  });
  $('#view_journal').click(function(e) {
    view("Journal: $('#wiki').wikimate('journal')", JSON.stringify($('#wiki').wikimate('journal'), null, 2));
  });
  $('#wiki').empty().wikimate({ story: readme.story }).wikimate('journal', readme.journal);
});
