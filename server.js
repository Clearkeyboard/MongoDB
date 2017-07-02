
// Dependencies
var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var ObjectId = require('mongojs').ObjectedID;
// Requiring our Note and Article models
var Article = require("./models/Article.js");
// Our scraping tools
var request = require("request");
var cheerio = require("cheerio");
// Set mongoose to leverage built in JavaScript ES6 Promises
mongoose.Promise = Promise;

// Require handlebars
var exphbs = require('express-handlebars');
// Initialize Express
var app = express();


// Use morgan and body parser with our app
app.use(bodyParser.urlencoded({
  extended: false
}));

// Create ExpressHandlebars instance with a default layout.
var hbs = exphbs.create({
  defaultLayout: 'main'
})
// Set up view engine
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

// Make public a static dir
app.use(express.static("public"));

// Database configuration with mongoose
mongoose.connect("mongodb://localhost/scraper");
var db = mongoose.connection;

// Show any mongoose errors
db.on("error", function(error) {
  console.log("Mongoose Error: ", error);
});

// Once logged in to the db through mongoose, log a success message
db.once("open", function() {
  console.log("Mongoose connection successful.");
});


// Routes
// ======
app.get('/scrape', function(req, res) {
  // First, we grab the body of the html with request
  request('https://www.reddit.com/r/ProgrammerHumor/', function(error, response, html) {
    // Then, we load that into cheerio and save it to $ for a shorthand selector
    var $ = cheerio.load(html);
    // Now, we grab every h2 within an article tag, and do the following:
    $("p.title").each(function(i, element) {

      // Save an empty result object
      var result = {};

      // Add the text and href of every link, and save them as properties of the result object
      result.title = $(this).children("a").text();
      result.link = $(this).children("a").attr("href");

      // Using our Article model, create a new entry
      // This effectively passes the result object to the entry (and the title and link)
      var entry = new Article(result);

      // Now, save that entry to the db
      entry.save(function(err, doc) {
        // Log any errors
        if (err) {
          console.log(err);
        }
      });
    });
  })
  res.redirect('/');
});

app.get("/", function(req, res) {

    Article.find({}, function(error, data) {
      if (error) {
        res.send(error);
      }
      else {
          res.render('index', data)
        }
  });
});

// This will grab an article by it's ObjectId
app.get("/articles/:id", function(req, res) {

var article = req.params.id;
Article.findOne({'_id': article}).populate("note").exec(function(error, doc) {
  if (error) {
    res.send(error);
  }
  else {
    res.json(doc);
  }
});

});

// Create a new note or replace an existing note
app.post("/articles/:id/comment", function(req, res) {
  //Find the article to add a note to by ID
  Article.findByIdAndUpdate(
    req.params.id,
    // Push to the empty array of Notes
    {$push: {
      //Note object to push into Note Array
      note: {
        body: req.body.body,
        user: req.body.user
      }
    }},
    //Upsert creates new data each time instead of overwriting existing
    {upsert: true, new: true},
    function(err, data) {
      if (err) return console.log(err);
      res.json(data.note)
    }
  )
});
// Listen on port 3000
app.listen(3000, function() {
  console.log("App running on port 3000!");
});
