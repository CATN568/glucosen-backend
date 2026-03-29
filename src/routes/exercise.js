const express = require('express');
const router = express.Router();
const exerciseController = require('../controllers/exerciseController');
const { authMiddleware } = require('../middleware/auth');

router.use(authMiddleware);

router.post('/', exerciseController.createExerciseLog);
router.get('/', exerciseController.getExerciseLogs);
router.get('/range', exerciseController.getExerciseLogsByDateRange);
router.get('/statistics', exerciseController.getExerciseStatistics);
router.put('/:id', exerciseController.updateExerciseLog);
router.delete('/:id', exerciseController.deleteExerciseLog);

module.exports = router;
