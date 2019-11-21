// Dependencies
// =============================================================
var express = require("express");
var path = require("path");
var fs = require("fs");


// Sets up the Express App
// =============================================================
var app = express();
var PORT = process.env.PORT || 3000;
const notes = require("./db/db.json")

// Sets up the Express app to handle data parsing
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Routes
// =============================================================

// Basic route that sends the user first to the AJAX Page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/index.html"));
});

app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/notes.html"));
});

app.post("/api/notes/", (req, res) => {
  var newNote = req.body;
  newNote.id = notes.length;

  notes.push(newNote);

  fs.writeFile("./db/db.json", JSON.stringify(notes), function (err) {
    if (err) {
      console.log(err);
    }
    else {
      console.log("Commit logged!");
    }

  });

  res.json(newNote);
});

app.get("/api/notes", (req, res) => {
  res.json(notes);
});

app.get('/api/notes/:index', (req, res) => {
  const index = req.params.index;
  res.json(notes[index-1]);
});

app.delete("/api/notes/:id", (req, res) => {
  console.log("Hey!")
  const id = req.params.id;
  for (let i = 0; i < notes.length; i++) {
    const note = notes[i];
    if (note.id === parseInt(id)) {
      notes.splice(i, 1);
    }
  };

  fs.writeFile('db/db.json', JSON.stringify(notes, function (err) {
    if (err) {
      console.log(err)
    }
    else {
      console.log("Committed")
    }
    res.json(notes)
  })

  )
});












// Starts the server to begin listening
// =============================================================
app.listen(PORT, function () {
  console.log("App listening on PORT " + PORT);
});
