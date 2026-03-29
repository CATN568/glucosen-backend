const express = require('express');
const router = express.Router();
const insulinController = require('../controllers/insulinController');
const { authMiddleware } = require('../middleware/auth');

router.use(authMiddleware);

router.post('/', insulinController.createInsulinLog);
router.get('/', insulinController.getInsulinLogs);
router.get('/range', insulinController.getInsulinLogsByDateRange);
router.get('/daily-total', insulinController.getTotalUnitsDaily);
router.put('/:id', insulinController.updateInsulinLog);
router.delete('/:id', insulinController.deleteInsulinLog);

module.exports = router;
