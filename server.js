var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");

// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
var axios = require("axios");
var cheerio = require("cheerio");

var PORT = 3000;

// Require all models
var db = require("./models");

// Initialize Express
var app = express();

// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));
// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: true }));
// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));

// Connect to the Mongo DB
mongoose.connect("mongodb://localhost/newsHeadlines");

app.get("/scrape", function(req, res){
  axios.get("https://www.democracynow.org/").then(function(response){
    var $ = cheerio.load(response.data);

    $(".content h1").each(function(i, element) {
      var result = {};

      result.title = $(this)
      .children("a")
      .text();
      result.link = $(this)
      .children("a")
      .attr("href")

      db.Article.create(result)
      .then(function(dbArticle){
        console.log(dbArticle)
      })
      .catch(function(err) {
        return res.json(err);
      })
    })

    res.send("Scrape Complete");
    console.log(Article)
    console.log(db)
  })
})

app.listen(PORT, function(){
  console.log("App running on port " + PORT + "!")
})