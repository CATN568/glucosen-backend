const Meal = require('../models/Meal');
const { validateMeal } = require('../utils/validators');

const createMeal = async (req, res, next) => {
  try {
    const { mealType, mealTime, description = '', carbs = 0, protein = 0, fat = 0, calories = 0 } = req.body;

    if (!mealType || !mealTime) {
      return res.status(400).json({ error: 'Meal type and meal time are required' });
    }

    validateMeal({ meal_type: mealType, meal_time: mealTime });

    const meal = await Meal.create(
      req.user.userId,
      mealType,
      mealTime,
      description,
      carbs,
      protein,
      fat,
      calories
    );

    res.status(201).json({
      message: 'Meal created successfully',
      data: meal,
    });
  } catch (error) {
    next(error);
  }
};

const getMeals = async (req, res, next) => {
  try {
    const { limit = 30, offset = 0 } = req.query;
    const meals = await Meal.getByUserId(
      req.user.userId,
      parseInt(limit),
      parseInt(offset)
    );

    res.json({
      data: meals,
      count: meals.length,
    });
  } catch (error) {
    next(error);
  }
};

const getMealsByDateRange = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({ error: 'Start date and end date are required' });
    }

    const meals = await Meal.getByDateRange(
      req.user.userId,
      startDate,
      endDate
    );

    res.json({
      data: meals,
      count: meals.length,
    });
  } catch (error) {
    next(error);
  }
};

const updateMeal = async (req, res, next) => {
  try {
    const { id } = req.params;

    const meal = await Meal.update(id, req.user.userId, req.body);

    if (!meal) {
      return res.status(404).json({ error: 'Meal not found' });
    }

    res.json({
      message: 'Meal updated successfully',
      data: meal,
    });
  } catch (error) {
    next(error);
  }
};

const deleteMeal = async (req, res, next) => {
  try {
    const { id } = req.params;

    const meal = await Meal.delete(id, req.user.userId);

    if (!meal) {
      return res.status(404).json({ error: 'Meal not found' });
    }

    res.json({ message: 'Meal deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createMeal,
  getMeals,
  getMealsByDateRange,
  updateMeal,
  deleteMeal,
};
