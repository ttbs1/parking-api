const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;

router.get('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error)
            return res.status(500).send({
                error: error,
                response: null
            });
        
        conn.query(
            'SELECT * FROM tickets',
            (error, result, field) => {
                conn.release();
                if (error) {
                    return res.status(500).send({
                        error: error,
                        response: null
                    });
                }
                const response = {
                    length: result.length,
                    request: {
                        type: 'GET',
                        description: 'Return all tickets'
                    },
                    tickets: result.map(ticket => {
                        return {
                            id: ticket.id,
                            placa: ticket.placa,
                            tarifa: ticket.tarifa,
                            datahora: ticket.datahora,
                            url: 'http://localhost:3000/tickets/' + ticket.id
                        }
                    }) 
                    
                }
                res.status(201).send(response);
            }
        )
    });
});

router.post('/', (req, res, next) => {

    mysql.getConnection((error, conn) => {
        if (error)
            return res.status(500).send({
                error: error,
                response: null
            });
        
        conn.query(
            'INSERT INTO tickets (placa, tarifa) VALUES (?,?)',
            [req.body.placa, req.body.tarifa],
            (error, result, field) => {
                conn.release();
                if (error) {
                    return res.status(500).send({
                        error: error,
                        response: null
                    });
                }
                const response = {
                    lenght: result.lenght,

                }
                res.status(201).send({
                    mensagem: 'Ticket criado com sucesso',
                    id: result.insertId
                });
            }
        )
    });
});

router.get('/:id', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error)
            return res.status(500).send({
                error: error,
                response: null
            });
        
        conn.query(
            'SELECT * FROM tickets WHERE id = ?',
            [req.params.id],
            (error, result, field) => {
                conn.release();
                if (error) {
                    return res.status(500).send({
                        error: error,
                        response: null
                    });
                }
                const response = {
                    request: {
                        type: 'GET',
                        description: 'Return ticket by id'
                    },
                    tickets: result.map(ticket => {
                        return {
                            id: ticket.id,
                            placa: ticket.placa,
                            tarifa: ticket.tarifa,
                            datahora: ticket.datahora,
                        }
                    }) 
                    
                }
                res.status(201).send(response);
            }
        )
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
