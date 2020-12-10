const mysql = require('../mysql').pool;

exports.getTickets = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error)
            return res.status(500).send({
                error: error,
                response: null
            });
        
        conn.query(
            'SELECT t.id, c.name, t.plate, t.rate, t.start, t.end FROM ticket AS t LEFT JOIN client AS c ON t.client_id = c.id',
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
                            client: ticket.name,
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
                res.status(200).send(response);
            }
        )
    });
};

exports.postTicket = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error)
            return res.status(500).send({
                error: error,
                response: null
            });
        
        conn.query(
            'INSERT INTO ticket (client_id, plate, rate) VALUES (?,?,?)',
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
                    message: 'Ticket criado com sucesso',
                    id: result.insertId
                });
            }
        )
    });
};

exports.getTicket = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error)
            return res.status(500).send({
                error: error,
                response: null
            });
        
        conn.query(
            'SELECT t.id, c.name, t.plate, t.rate, t.start, t.end FROM ticket AS t LEFT JOIN client AS c ON t.client_id = c.id WHERE t.id = ?',
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
                            client: ti.name,
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
                res.status(200).send(response);
            }
        )
    });
};

exports.patchTicket = (req, res, next) => {
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
                res.status(202).send(response);
            }
        )
    });
};

exports.deleteTicket = (req, res, next) => {
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
                res.status(202).send(response);
            }
        )
    });
};