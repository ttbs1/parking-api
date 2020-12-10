const express = require('express');
const router = express.Router();
const login = require('../middleware/login');

const ticketController = require('../controller/ticketController');

router.get('/', login, ticketController.getTickets);
router.post('/', login, ticketController.postTicket);
router.get('/:id', login, ticketController.getTicket);
router.patch('/:id', login, ticketController.patchTicket);
router.delete('/:id', login, ticketController.deleteTicket);

module.exports = router;