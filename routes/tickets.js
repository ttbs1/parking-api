const express = require('express');
const app = require('../app');
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
            'SELECT * FROM ticket',
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
                            plate: ticket.plate,
                            rate: ticket.rate,
                            start: ticket.start,
                            end: ticket.end,
                            request: {
                                type: 'GET',
                                description: 'Return ticket from id',
                                url: process.env.URL_API + 'tickets/' + ticket.id
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
            'INSERT INTO ticket (client_id, plate, rate) VALUES (?,?)',
            [req.body.client_id, req.body.plate, req.body.rate],
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
            'SELECT * FROM ticket WHERE id = ?',
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
                    ticket: result.map(ti => {
                        return {
                            id: ti.id,
                            plate: ti.plate,
                            rate: ti.rate,
                            start: ti.start,
                            end: ti.end,
                            request: {
                                type: 'GET',
                                description: 'Return all tickets',
                                url: process.env.URL_API + 'tickets'
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
            'UPDATE ticket SET client_id = ?, plate = ?, rate = ? WHERE id = ?',
            [req.body.client_id, req.body.plate, req.body.rate, req.params.id],
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
                        client_id: req.body.client_id,
                        plate: req.body.plate,
                        rate: req.body.rate,
                        request: {
                            type: 'GET',
                            description: 'Return ticket by id',
                            url: process.env.URL_API + 'tickets/' + req.params.id
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
            'DELETE FROM ticket WHERE id = ?',
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
                        url: process.env.URL_API + 'tickets'
                    }
                }
                res.status(201).send(response);
            }
        )
    });
});

module.exports = router;