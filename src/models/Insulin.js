const pool = require('../config/database');

class Insulin {
  static async create(userId, insulinType, units, administrationTime, notes = '') {
    const result = await pool.query(
      `INSERT INTO insulin_logs (user_id, insulin_type, units, administration_time, notes)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [userId, insulinType, units, administrationTime, notes]
    );
    return result.rows[0];
  }

  static async getByUserId(userId, limit = 30, offset = 0) {
    const result = await pool.query(
      `SELECT * FROM insulin_logs 
       WHERE user_id = $1 
       ORDER BY administration_time DESC 
       LIMIT $2 OFFSET $3`,
      [userId, limit, offset]
    );
    return result.rows;
  }

  static async getByDateRange(userId, startDate, endDate) {
    const result = await pool.query(
      `SELECT * FROM insulin_logs 
       WHERE user_id = $1 AND administration_time BETWEEN $2 AND $3
       ORDER BY administration_time DESC`,
      [userId, startDate, endDate]
    );
    return result.rows;
  }

  static async getTotalUnitsDaily(userId, date) {
    const result = await pool.query(
      `SELECT SUM(units) as total_units 
       FROM insulin_logs 
       WHERE user_id = $1 AND DATE(administration_time) = $2`,
      [userId, date]
    );
    return result.rows[0].total_units || 0;
  }

  static async update(id, userId, updates) {
    const { insulinType, units, administrationTime, notes } = updates;
    
    const result = await pool.query(
      `UPDATE insulin_logs 
       SET insulin_type = COALESCE($1, insulin_type),
           units = COALESCE($2, units),
           administration_time = COALESCE($3, administration_time),
           notes = COALESCE($4, notes)
       WHERE id = $5 AND user_id = $6
       RETURNING *`,
      [insulinType, units, administrationTime, notes, id, userId]
    );
    return result.rows[0];
  }

  static async delete(id, userId) {
    const result = await pool.query(
      'DELETE FROM insulin_logs WHERE id = $1 AND user_id = $2 RETURNING id',
      [id, userId]
    );
    return result.rows[0];
  }
}

module.exports = Insulin;
