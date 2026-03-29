const pool = require('../config/database');

class GlucoseReading {
  static async create(userId, glucoseLevel, readingTime, unit = 'mg/dL', notes = '') {
    const result = await pool.query(
      `INSERT INTO glucose_readings (user_id, glucose_level, unit, reading_time, notes)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [userId, glucoseLevel, unit, readingTime, notes]
    );
    return result.rows[0];
  }

  static async getByUserId(userId, limit = 30, offset = 0) {
    const result = await pool.query(
      `SELECT * FROM glucose_readings 
       WHERE user_id = $1 
       ORDER BY reading_time DESC 
       LIMIT $2 OFFSET $3`,
      [userId, limit, offset]
    );
    return result.rows;
  }

  static async getByDateRange(userId, startDate, endDate) {
    const result = await pool.query(
      `SELECT * FROM glucose_readings 
       WHERE user_id = $1 AND reading_time BETWEEN $2 AND $3
       ORDER BY reading_time DESC`,
      [userId, startDate, endDate]
    );
    return result.rows;
  }

  static async getStatistics(userId, days = 30) {
    const result = await pool.query(
      `SELECT 
        AVG(glucose_level) as average_glucose,
        MIN(glucose_level) as min_glucose,
        MAX(glucose_level) as max_glucose,
        STDDEV(glucose_level) as std_dev,
        COUNT(*) as total_readings
       FROM glucose_readings 
       WHERE user_id = $1 AND reading_time > NOW() - INTERVAL '${days} days'`,
      [userId]
    );
    return result.rows[0];
  }

  static async update(id, userId, glucoseLevel, readingTime, notes) {
    const result = await pool.query(
      `UPDATE glucose_readings 
       SET glucose_level = $1, reading_time = $2, notes = $3, updated_at = CURRENT_TIMESTAMP
       WHERE id = $4 AND user_id = $5
       RETURNING *`,
      [glucoseLevel, readingTime, notes, id, userId]
    );
    return result.rows[0];
  }

  static async delete(id, userId) {
    const result = await pool.query(
      'DELETE FROM glucose_readings WHERE id = $1 AND user_id = $2 RETURNING id',
      [id, userId]
    );
    return result.rows[0];
  }
}

module.exports = GlucoseReading;
