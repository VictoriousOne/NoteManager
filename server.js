
const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');


// parse incoming string or array data
app.use(express.urlencoded({ extended: true }));
// parse incoming JSON data
app.use(express.json());
app.use(express.static('public'));

const notes = require('./data/notes.json');
const PORT = process.env.PORT || 3001;
const uuid = require('./helpers/uuid');

app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, './public/index.html'))
);


app.get('/api/notes', (req, res) => {

  let readNotes = JSON.parse(fs.readFileSync('./data/notes.json'));
  res.json(readNotes);
});


app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, './public/notes.html'));
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, './public/index.html'));
});

app.post('/api/notes', (req, res) => {

  // Destructuring assignment for the items in req.body
  const { title, text } = req.body;

  // If all the required properties are present
  if (title && text) {
    // Variable for the object we will save
    const newNote = {
      title,
      text,
      note_id: uuid(),
    };


    // Obtain existing notes
    fs.readFile('./data/notes.json', 'utf8', (err, data) => {
      if (err) {
        console.error(err);
      }
      else {
        // Convert string into JSON object
        const parsedNotes = JSON.parse(data);

        // Add a new note
        parsedNotes.push(newNote);

        // Write updated notes back to the file
        fs.writeFileSync('./data/notes.json',
          JSON.stringify(parsedNotes, null, 4),
          (writeErr) =>
            writeErr
              ? console.error(writeErr)
              : console.info('Successfully updated notes!')
        );
        //res.json(parsedNotes);
      }
    });


    const response = {
      status: 'success',
      body: newNote,
    };

    console.log(response);
    res.json(newNote);
  }
  else {
    res.json('Error in posting review');
  }
});

app.delete('/api/notes/:id', (req, res) => {


  const noteId = req.params.id;

  // Obtain existing notes
  fs.readFile('./data/notes.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
    }
    else {
      // Convert string into JSON object
      const parsedNotes = JSON.parse(data);
      //console.log("******Deleting NoteID************** " + noteId);
      newParsedNotes = parsedNotes.filter(x => x.note_id !== noteId);
      //console.log(newParsedNotes);

      
      //parsedNotes.push(newNote);

      // Write updated notes back to the file
      fs.writeFileSync('./data/notes.json',
        JSON.stringify(newParsedNotes, null, 4),
        (writeErr) =>
          writeErr
            ? console.error(writeErr)
            : console.info('Successfully updated notes!')
      );
      res.json(parsedNotes);
    }
  });

});



app.listen(PORT, () => {
  console.log(`API server now on port ${PORT}!`);
});