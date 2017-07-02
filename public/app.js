$('#scrape').on('click', function(){
  window.location.href = '/scrape'
})

$('.nabb').on('click', function() {
  var ID = $(this).attr("data-id");
  $.ajax({
    method: "GET",
    url: "/articles/" + ID
  }).done(function(data){
  for (var i = 0; i < data.note.length; i++) {
    $('#comments').append("<h2 id='user'>" + data.note[i].user + "</h2>");
  }
    console.log(data.note);
  })
})
// When you click the savenote button
$(document).on("click", "#savenote", function() {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId + '/comment',
    data: {
      // Value taken from note textarea
      body: $("#bodyinput").val(),
      // Value taken from Username input
      user: $("#username").val()
    }
  })
    // With that done
    .done(function(data) {
      console.log(data)
  // Also, remove the values entered in the input and textarea for note entry
  $("#bodyinput").val("");
    })
});
