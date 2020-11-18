const express = require('express');
const app = express();

const rotaTickets = require('./routes/tickets');

app.use('/tickets', rotaTickets);

module.exports = app; 