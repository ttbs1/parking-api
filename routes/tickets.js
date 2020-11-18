const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    res.status(200).send({
        mensagem: 'usando GET dentro da rota de tickets'
    });
});

router.post('/', (req, res, next) => {
    res.status(201).send({
        mensagem: 'usando POST dentro da rota de tickets'
    });
});

module.exports = router;
