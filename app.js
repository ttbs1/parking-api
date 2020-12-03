const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


// --->>> ROTAS <<<---
const routeTickets = require('./routes/tickets');
const routeClients = require('./routes/clients');
const routeUsers = require('./routes/users');
app.use('/tickets', routeTickets);
app.use('/clients', routeClients);
app.use('/users', routeUsers);

app.use((req, res, next) => {
    const erro = new Error('Não encontrado');
    erro.status = 404;
    next(erro);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    return res.send({
        erro: {
            mensagem: error.message
        }
    });
});

module.exports = app; 