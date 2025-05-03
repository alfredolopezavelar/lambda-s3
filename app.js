const express = require('express');
const cors = require('cors');
const imgHandler = require('./controllers/img-handler.js')

const app = express();
app.use(cors());
app.use(express.json());


app.use('/img', imgHandler);
app.get('/', (req, res) => {
    res.send('Wlcome to the image upload service!')
})

module.exports = app;