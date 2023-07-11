const express = require('express');
const routes = require('./routes/index.js');
const port = process.env.PORT || 3333;
const bodyparser = require('body-parser');
const cors = require('cors');
const app = express();
const server = require('http').createServer(app);
require('dotenv').config()

app.use(bodyparser.json())

app.use(cors());

server.listen(port, () => {
    console.log('Server started at port ' + `http://localhost:${port}/api/`)
});

app.use('/api', routes);