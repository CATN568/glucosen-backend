const pool = require('../config/database');

class Meal {
  static async create(userId, mealType, mealTime, description = '', carbs = 0, protein = 0, fat = 0, calories = 0) {
    const result = await pool.query(
      `INSERT INTO meals (user_id, meal_type, meal_time, description, carbs, protein, fat, calories)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [userId, mealType, mealTime, description, carbs, protein, fat, calories]
    );
    return result.rows[0];
  }

  static async getByUserId(userId, limit = 30, offset = 0) {
    const result = await pool.query(
      `SELECT * FROM meals 
       WHERE user_id = $1 
       ORDER BY meal_time DESC 
       LIMIT $2 OFFSET $3`,
      [userId, limit, offset]
    );
    return result.rows;
  }

  static async getByDateRange(userId, startDate, endDate) {
    const result = await pool.query(
      `SELECT * FROM meals 
       WHERE user_id = $1 AND meal_time BETWEEN $2 AND $3
       ORDER BY meal_time DESC`,
      [userId, startDate, endDate]
    );
    return result.rows;
  }

  static async update(id, userId, updates) {
    const { mealType, mealTime, description, carbs, protein, fat, calories } = updates;
    
    const result = await pool.query(
      `UPDATE meals 
       SET meal_type = COALESCE($1, meal_type),
           meal_time = COALESCE($2, meal_time),
           description = COALESCE($3, description),
           carbs = COALESCE($4, carbs),
           protein = COALESCE($5, protein),
           fat = COALESCE($6, fat),
           calories = COALESCE($7, calories)
       WHERE id = $8 AND user_id = $9
       RETURNING *`,
      [mealType, mealTime, description, carbs, protein, fat, calories, id, userId]
    );
    return result.rows[0];
  }

  static async delete(id, userId) {
    const result = await pool.query(
      'DELETE FROM meals WHERE id = $1 AND user_id = $2 RETURNING id',
      [id, userId]
    );
    return result.rows[0];
  }
}

module.exports = Meal;
