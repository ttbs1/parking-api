const express = require('express');
const router = express.Router();
const login = require('../middleware/login');

const clientController = require('../controller/clientController');

router.get('/', login, clientController.getClients);
router.post('/', login, clientController.postClient);
router.get('/:id', login, clientController.getClient);
router.patch('/:id', login, clientController.patchClient);
router.delete('/:id', login, clientController.deleteClient);

module.exports = router;