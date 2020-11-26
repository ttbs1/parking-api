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
                    tickets: result.map(ticket => {
                        return {
                            id: ticket.id,
                            placa: ticket.placa,
                            tarifa: ticket.tarifa,
                            datahora: ticket.datahora,
                            request: {
                                type: 'GET',
                                description: 'Return ticket from id',
                                url: 'http://localhost:3000/tickets/' + ticket.id
                            },
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
                    tickets: result.map(ticket => {
                        return {
                            id: ticket.id,
                            placa: ticket.placa,
                            tarifa: ticket.tarifa,
                            datahora: ticket.datahora,
                            request: {
                                type: 'GET',
                                description: 'Return all tickets',
                                url: 'http://localhost:3000/tickets'
                            }
                        }
                    }) 
                }
                res.status(201).send(response);
            }
        )
    });
});

router.patch('/:id', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error)
            return res.status(500).send({
                error: error,
                response: null
            });
        
        conn.query(
            'UPDATE tickets SET placa = ?, tarifa = ? WHERE id = ?',
            [req.body.placa, req.body.tarifa, req.params.id],
            (error, result, field) => {
                conn.release();
                if (error) {
                    return res.status(500).send({
                        error: error,
                        response: null
                    });
                }
                const response = {
                    message: 'Ticket atualizado com sucesso',
                    updatedTicket: {
                        id: req.params.id,
                        placa: req.body.placa,
                        tarifa: req.body.tarifa,
                        request: {
                            type: 'GET',
                            description: 'Return ticket by id',
                            url: 'http://localhost:3000/tickets/' + req.params.id
                        }
                    }
                }
                res.status(201).send(response);
            }
        )
    });
});

router.delete('/:id', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error)
            return res.status(500).send({
                error: error,
                response: null
            });
        
        conn.query(
            'DELETE FROM tickets WHERE id = ?',
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
                    message: 'Ticket excluído com sucesso',
                    id: req.params.id,
                    request: {
                        type: 'GET',
                        description: 'Return all tickets',
                        url: 'http://localhost:3000/tickets'
                    }
                }
                res.status(201).send(response);
            }
        )
    });
});

module.exports = router;
