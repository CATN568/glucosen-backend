const express = require('express');
const router = express.Router();
const glucoseController = require('../controllers/glucoseController');
const { authMiddleware } = require('../middleware/auth');

router.use(authMiddleware);

router.post('/', glucoseController.createReading);
router.get('/', glucoseController.getReadings);
router.get('/range', glucoseController.getReadingsByDateRange);
router.get('/statistics', glucoseController.getStatistics);
router.put('/:id', glucoseController.updateReading);
router.delete('/:id', glucoseController.deleteReading);

module.exports = router;
