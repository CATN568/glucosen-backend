const express = require('express');
const router = express.Router();
const mealController = require('../controllers/mealController');
const { authMiddleware } = require('../middleware/auth');

router.use(authMiddleware);

router.post('/', mealController.createMeal);
router.get('/', mealController.getMeals);
router.get('/range', mealController.getMealsByDateRange);
router.put('/:id', mealController.updateMeal);
router.delete('/:id', mealController.deleteMeal);

module.exports = router;
