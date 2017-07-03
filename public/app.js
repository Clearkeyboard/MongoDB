$('#scrape').on('click', function(){
  window.location.href = '/scrape'
})

//When clicking an Article
$('.nabb').on('click', function() {
    var ID = $(this).attr("data-id");
    $.ajax({
      method: "GET",
      url: "/articles/" + ID
    }).done(function(data){
    if (data.note.length === 0) {
      return
  } else {
    for (var i = 0; i < data.note.length; i++) {
      $('#comments').append("<div class='row field' id='" + data.note[i]._id + "'>")
      $('#' + data.note[i]._id + '').append("<h2 id='" + data.note[i]._id + " ' class='col-md-12 text-left user'>" + data.note[i].user + "</h2>")
      $('#' + data.note[i]._id + '').append("<p id='" + i + "'class='col-md-12 text-left'>" + data.note[i].body + "</p>")
      $('#' + i + '').append("<div class='row' id='r" + i + "'>")
      $('#r' + i + '').append("<div class='col-md-12 text-right' id='delete'><button type='button' id='del' class='btn' data-del='" + data._id + "' data-id='" + data.note[i]._id + "'>Del");
      // Clears Modal when not in view. Allows app to restore current Notes on click again
      $('.modal-sm2').on('hidden.bs.modal', function() {
        $('.field').remove();
      })
    }
      console.log(data.note);
    }
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

// When clicking del button
$(document).on('click', '#del', function() {
  var articleId = $(this).attr("data-del");
  var delId = $(this).attr("data-id");
  console.log(articleId);
  console.log(delId);
  $.ajax({
    method: "POST",
    url: "/remove/" + articleId,
    data: {
      id: articleId,
      _id: delId 
    }
  }).done(function(data) {
    console.log(data);
  })
})
