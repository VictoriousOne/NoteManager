
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



app.get('/api/notes', (req, res) => {
    console.log(notes);
    res.json(notes);
})

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


       // Obtain existing reviews
    fs.readFile('./data/notes.json', 'utf8', (err, data) => {
        if (err) {
          console.error(err);
        } else {
          // Convert string into JSON object
          const parsedNotes = JSON.parse(data);
  
          // Add a new review
          parsedNotes.push(newNote);
  
          // Write updated reviews back to the file
          fs.writeFile(
            './data/notes.json',
            JSON.stringify(parsedNotes, null, 4),
            (writeErr) =>
              writeErr
                ? console.error(writeErr)
                : console.info('Successfully updated reviews!')
          );
        }
      });
  
      const response = {
        status: 'success',
        body: newNote,
      };
  
      console.log(response);
      res.json(response);
    } else {
      res.json('Error in posting review');
    }
  });
  

app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});