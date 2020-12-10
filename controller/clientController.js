const mysql = require('../mysql').pool;

exports.getClients = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error)
            return res.status(500).send({
                error: error,
                response: null
            });
        
        conn.query(
            'SELECT * FROM client',
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
                    clients: result.map(client => {
                        return {
                            id: client.id,
                            name: client.name,
                            accumulated_time: client.accumulated_time,
                            total_time: client.total_time,
                            total_spent: client.total_spent,
                            request: {
                                type: 'GET',
                                description: 'Return client from id',
                                url: process.env.URL_API + 'clients/' + client.id
                            },
                        }
                    })
                }
                res.status(200).send(response);
            }
        )
    });
};

exports.postClient = (req, res, next) => {

    mysql.getConnection((error, conn) => {
        if (error)
            return res.status(500).send({
                error: error,
                response: null
            });
        
        conn.query(
            'INSERT INTO client (name) VALUE (?)',
            [req.body.name],
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
                    message: 'Cliente cadastrado com sucesso',
                    id: result.insertId
                });
            }
        )
    });
};

exports.getClient = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error)
            return res.status(500).send({
                error: error,
                response: null
            });
        
        conn.query(
            'SELECT * FROM client WHERE id = ?',
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
                    client: result.map(cli => {
                        return {
                            id: cli.id,
                            name: cli.name,
                            accumulated_time: cli.accumulated_time,
                            total_time: cli.total_time,
                            total_spent: cli.total_spent,
                            request: {
                                type: 'GET',
                                description: 'Return all clients',
                                url: process.env.URL_API + 'clients'
                            }
                        }
                    }) 
                }
                res.status(200).send(response);
            }
        )
    });
};

exports.patchClient = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error)
            return res.status(500).send({
                error: error,
                response: null
            });
        
        conn.query(
            'UPDATE client SET name = ?, accumulated_time = ?, total_time = ?, total_spent = ? WHERE id = ?',
            [req.body.name, req.body.accumulated_time, req.body.total_time, req.body.total_spent, req.params.id],
            (error, result, field) => {
                conn.release();
                if (error) {
                    return res.status(500).send({
                        error: error,
                        response: null
                    });
                }
                const response = {
                    message: 'Cliente atualizado com sucesso',
                    updatedTicket: {
                        id: req.params.id,
                        client_id: req.body.client_id,
                        plate: req.body.plate,
                        rate: req.body.rate,
                        request: {
                            type: 'GET',
                            description: 'Return client by id',
                            url: process.env.URL_API + 'clients/' + req.params.id
                        }
                    }
                }
                res.status(202).send(response);
            }
        )
    });
};

exports.deleteClient = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error)
            return res.status(500).send({
                error: error,
                response: null
            });
        
        conn.query(
            'DELETE FROM client WHERE id = ?',
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
                    message: 'Cliente excluído com sucesso',
                    id: req.params.id,
                    request: {
                        type: 'GET',
                        description: 'Return all clients',
                        url: process.env.URL_API + 'clients'
                    }
                }
                res.status(202).send(response);
            }
        )
    });
};