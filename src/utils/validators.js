const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password) => {
  if (password.length < 8) {
    throw new Error('Password must be at least 8 characters long');
  }
  return true;
};

const validateGlucoseReading = (glucoseLevel) => {
  const level = parseFloat(glucoseLevel);
  if (isNaN(level) || level < 0 || level > 600) {
    throw new Error('Glucose level must be between 0 and 600 mg/dL');
  }
  return true;
};

const validateMeal = (meal) => {
  if (!meal.meal_type || !meal.meal_time) {
    throw new Error('Meal type and meal time are required');
  }
  return true;
};

module.exports = {
  validateEmail,
  validatePassword,
  validateGlucoseReading,
  validateMeal,
};
