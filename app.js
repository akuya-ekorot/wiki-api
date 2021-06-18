const express = require("express");
const ejs = require("ejs");
const mongoose = require("mongoose");
const app = express();

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));

//MongoDB Setup
const url = "mongodb://localhost:27017/wikiDB";

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });

const articleSchema = {
  title: String,
  content: String,
};

const Article = mongoose.model("Article", articleSchema);

//TODO

app
  .route("/articles")

  //Fetch all the articles
  .get((req, res) => {
    Article.find({}, (err, docs) => {
      if (err) {
        res.send(err);
      } else {
        console.log("Found all the articles.");
        res.send(docs);
      }
    });
  })

  //Create or Post new article
  .post((req, res) => {
    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content,
    });

    newArticle.save((err) => {
      if (err) {
        res.send(err);
      } else {
        res.send("Succesfully added new article.");
      }
    });
  })

  //Delete or Remove all articles
  .delete((req, res) => {
    Article.deleteMany({}, (err, doc) => {
      if (err) {
        res.send(err);
      } else {
        res.send(`Succesfully deleted ${doc.deletedCount} articles`);
      }
    });
  });

app
  //Target a specific article
  .route("/articles/:title")

  //Get specific article
  .get((req, res) => {
    Article.findOne({ title: req.params.title }, (err, doc) => {
      if (err) {
        res.send(err);
      } else {
        res.send(doc);
      }
    });
  })

  //Replace a specific article and Puts a new one
  .put((req, res) => {
    Article.replaceOne(
      { title: req.params.title },
      { title: req.body.title, content: req.body.content },
      (err, doc) => {
        if (err) {
          res.send(err);
        } else {
          res.send(doc);
        }
      }
    );
  })

  //Update a specific article by Patching it with new data
  .patch((req, res) => {
    Article.updateOne(
      { title: req.params.title },
      { title: req.body.title, content: req.body.content },
      { omitUndefined: true },
      (err, doc) => {
        if (err) {
          res.send(err);
        } else {
          res.send(doc);
        }
      }
    );
  })

  //Delete a specific article
  .delete((req, res) => {
    Article.deleteOne({ title: req.params.title }, (err) => {
      if (err) {
        res.send(err);
      } else {
        res.send("Succesfully deleted the article");
      }
    });
  });

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
