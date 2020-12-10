const mysql = require('../mysql').pool;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.login = (req, res, next) => {

    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) };
        conn.query('SELECT * FROM user WHERE username = ?', [req.body.username], (error, results) => {
            conn.release();
            if (error) { return res.status(500).send({ error: error }) };
            if (!results.length > 0) { return res.status(404).send({ message: "Usuário não cadastrado" })}
            bcrypt.compare(req.body.password, results[0].password, (err, result) => {
                if (err) {return res.status(417).send({message: 'Falha na autenticação'})};
                if (result) {
                    let token = jwt.sign({
                        id: results[0].id,
                        username: results[0].username
                    }, 
                    process.env.JWT_KEY,
                    {
                        expiresIn: "7 days"
                    });
                    return res.status(200).send({message: "Autenticado com sucesso", token: token})
                };
                return res.status(401).send({message: "Senha inválida"});
            });

        });
    });
};

exports.signUp = (req, res, next) => {

    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) };
        conn.query('SELECT username FROM user WHERE username = ?', [req.body.username], (error, result) => {
            conn.release();
            if (error) { return res.status(500).send({ error: error }) }
            if (result.length > 0) {
                res.status(409).send({ message: 'O usuário já existe' });
            } else {
                bcrypt.hash(req.body.password, 10, (errBcrypt, hash) => {
                    if (errBcrypt) { return res.status(500).send({ error: errBcrypt }) }
                    conn.query(
                        'INSERT INTO user (username, password) VALUES (?,?)',
                        [req.body.username, hash],
                        (error, result) => {
                            conn.release();
                            if (error) { return res.status(500).send({ error: error }) }
                            const response = {
                                message: 'Usuário registrado com sucesso',
                                newUser: {
                                    id: result.insertId,
                                    username: req.body.username
                                }
                            }
                            res.status(201).send(response);
                    });
                });
            }
        });
    });
};