const express = require('express');
const router = express.Router();
const eventController = require('../backend/controllers/eventController');

router.get('/', eventController.getAllEvents);
router.post('/', eventController.createEvent);

module.exports = router;
