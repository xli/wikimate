function saveData() {
  var wiki = {story: $('#wiki').wikimate('story'), journal: $('#wiki').wikimate('journal')};
  $('#wiki-data').val(JSON.stringify(wiki));
}
function loadData() {
  var wiki = $.parseJSON($('#wiki-data').val());
  $('#wiki')
    .empty()
    .wikimate($.extend(readme, {change: function(e, a) { saveData(); }}))
    .wikimate('journal', readme.journal)
    .dropfile({
      field_name: "field_name",
      post_url: "/", // update post_url to some where accepts a post with field_name and save the file
      start: function(xhr, file) {
        console.log("uploading started");
      },
      complete: function(event, file) {
        console.log("upload complete");
        var pathToFile = e.target.responseText;
        var link = "[" + file_name + "](" + pathToFile + ")";
        if ((/image/i).test(file.type)) {
          link = "!" + link;
        }
        this.wikimate("newItem", {type: 'markdown', text: link}).story_item('save');
      }
    });
}
$(document).ready(function() {
  $('#reload').click(function() {
    loadData();
  });
  $('#undo').click(function(e) {
    $('#wiki').wikimate('undo');
    saveData();
  });
  $('#wiki-data').val(JSON.stringify(readme));
  loadData();
});