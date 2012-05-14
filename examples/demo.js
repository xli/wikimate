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
      post_url: "/",
      start: function(xhr, file) {
        console.log("uploading started");
      },
      complete: function(event, file) {
        console.log("upload complete");
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