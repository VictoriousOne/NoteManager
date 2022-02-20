
const express = require('express');
const app = express();
const { notes } = require('./data/notes');
const PORT = process.env.PORT || 3001;



app.get('/api/notes', (req, res) => {
    console.log(notes);
    res.json(notes);
})

app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});