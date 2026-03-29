const pool = require('../config/database');

class Exercise {
  static async create(userId, activityType, durationMinutes, intensity, exerciseTime, caloriesBurned = 0, notes = '') {
    const result = await pool.query(
      `INSERT INTO exercise_logs (user_id, activity_type, duration_minutes, intensity, exercise_time, calories_burned, notes)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [userId, activityType, durationMinutes, intensity, exerciseTime, caloriesBurned, notes]
    );
    return result.rows[0];
  }

  static async getByUserId(userId, limit = 30, offset = 0) {
    const result = await pool.query(
      `SELECT * FROM exercise_logs 
       WHERE user_id = $1 
       ORDER BY exercise_time DESC 
       LIMIT $2 OFFSET $3`,
      [userId, limit, offset]
    );
    return result.rows;
  }

  static async getByDateRange(userId, startDate, endDate) {
    const result = await pool.query(
      `SELECT * FROM exercise_logs 
       WHERE user_id = $1 AND exercise_time BETWEEN $2 AND $3
       ORDER BY exercise_time DESC`,
      [userId, startDate, endDate]
    );
    return result.rows;
  }

  static async getStatistics(userId, days = 30) {
    const result = await pool.query(
      `SELECT 
        SUM(duration_minutes) as total_duration,
        SUM(calories_burned) as total_calories,
        COUNT(*) as total_sessions,
        AVG(duration_minutes) as avg_duration
       FROM exercise_logs 
       WHERE user_id = $1 AND exercise_time > NOW() - INTERVAL '${days} days'`,
      [userId]
    );
    return result.rows[0];
  }

  static async update(id, userId, updates) {
    const { activityType, durationMinutes, intensity, exerciseTime, caloriesBurned, notes } = updates;
    
    const result = await pool.query(
      `UPDATE exercise_logs 
       SET activity_type = COALESCE($1, activity_type),
           duration_minutes = COALESCE($2, duration_minutes),
           intensity = COALESCE($3, intensity),
           exercise_time = COALESCE($4, exercise_time),
           calories_burned = COALESCE($5, calories_burned),
           notes = COALESCE($6, notes)
       WHERE id = $7 AND user_id = $8
       RETURNING *`,
      [activityType, durationMinutes, intensity, exerciseTime, caloriesBurned, notes, id, userId]
    );
    return result.rows[0];
  }

  static async delete(id, userId) {
    const result = await pool.query(
      'DELETE FROM exercise_logs WHERE id = $1 AND user_id = $2 RETURNING id',
      [id, userId]
    );
    return result.rows[0];
  }
}

module.exports = Exercise;
