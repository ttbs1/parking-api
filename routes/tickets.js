const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;

router.get('/', (req, res, next) => {
    res.status(200).send({
        mensagem: 'usando GET dentro da rota de tickets'
    });
});

router.post('/', (req, res, next) => {

    mysql.getConnection(function (error, conn) {
        if (error)
            return res.status(500).send({
                error: error,
                response: null
            });
        
        conn.query(
            'INSERT INTO tickets (placa, tarifa) VALUES (?,?)',
            [req.body.placa, req.body.tarifa],
            function(error, resultado, field) {
                conn.release();
                if (error) {
                    return res.status(500).send({
                        error: error,
                        response: null
                    });
                }
                res.status(201).send({
                    mensagem: 'Ticket criado com sucesso',
                    id: resultado.insertId
                });
            }
        )
    });
});

router.get('/:id_produto', (req, res, next) => {
    const id = req.params.id_produto;
    res.status(200).send({
        mensagem: 'usando o GET by id',
        id: id
    });
});

router.patch('/:id_produto', (req, res, next) => {
    const id = req.params.id_produto;
    res.status(200).send({
        mensagem: 'usando o PATCH by id',
        id: id
    });
});

router.delete('/:id_produto', (req, res, next) => {
    const id = req.params.id_produto;
    res.status(200).send({
        mensagem: 'usando o Delete by id',
        id: id
    });
});

module.exports = router;
