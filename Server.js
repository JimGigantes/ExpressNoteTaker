var express = require("express");
var path = require("path");
const fs = require("fs");

var app = express();
var PORT = 3000;
// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
/////not sure on this one
app.use(express.static('public'));

// activeNote is used to keep track of the note in the textarea




app.get("/notes", function(req, res) {
    res.sendFile(path.join(__dirname, "/public/notes.html"));
   });


// if in the case we need to get or post information for the db.json


   app.get("/api/notes", function(req, res) {
    res.sendFile(path.join(__dirname, "db/db.json"));
});


//this is used with the save functionality found on Index.js
app.post("/api/notes", function(req, res) {
    let textToSave = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
    let note = req.body;
    let identifier = (textToSave.length).toString();
    note.id = identifier;
    textToSave.push(note);

    fs.writeFileSync("./db/db.json", JSON.stringify(textToSave));
    console.log("Note saved to db.json. Content: ", note);
    res.json(textToSave);
})
/// When the user clicks one of the notes saved to the list this will
/// grab that item from the db.json file and send it back to the index.js file as a res
app.get("/api/notes/:id", function(req, res) {
    let savedNotes = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
    res.json(savedNotes[Number(req.params.id)]);
});
app.delete("/api/notes/:id", function(req, res) {
    let savedNotes = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
    let noteID = req.params.id;
    let newID = 0;
    console.log(`Deleting note with ID ${noteID}`);
    savedNotes = savedNotes.filter(currNote => {
        return currNote.id != noteID;
    })
    
    for (currNote of savedNotes) {
        currNote.id = newID.toString();
        newID++;
    }

    fs.writeFileSync("./db/db.json", JSON.stringify(savedNotes));
    res.json(savedNotes);
})


  app.get("*", function(req, res) {
    res.sendFile(path.join(__dirname, "/public/index.html"));
   });



   app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
  });