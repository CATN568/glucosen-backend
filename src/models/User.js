const pool = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
  static async create(email, password, firstName, lastName, dateOfBirth) {
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const result = await pool.query(
      `INSERT INTO users (email, password_hash, first_name, last_name, date_of_birth)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, email, first_name, last_name, date_of_birth, created_at`,
      [email, hashedPassword, firstName, lastName, dateOfBirth]
    );
    
    return result.rows[0];
  }

  static async findByEmail(email) {
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );
    return result.rows[0];
  }

  static async findById(id) {
    const result = await pool.query(
      'SELECT id, email, first_name, last_name, date_of_birth, created_at FROM users WHERE id = $1',
      [id]
    );
    return result.rows[0];
  }

  static async verifyPassword(email, password) {
    const user = await this.findByEmail(email);
    if (!user) {
      return null;
    }
    
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return null;
    }
    
    return { id: user.id, email: user.email, first_name: user.first_name, last_name: user.last_name };
  }

  static async update(id, updates) {
    const { firstName, lastName, dateOfBirth } = updates;
    
    const result = await pool.query(
      `UPDATE users 
       SET first_name = COALESCE($1, first_name),
           last_name = COALESCE($2, last_name),
           date_of_birth = COALESCE($3, date_of_birth),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $4
       RETURNING id, email, first_name, last_name, date_of_birth, updated_at`,
      [firstName, lastName, dateOfBirth, id]
    );
    
    return result.rows[0];
  }

  static async delete(id) {
    const result = await pool.query(
      'DELETE FROM users WHERE id = $1 RETURNING id',
      [id]
    );
    return result.rows[0];
  }
}

module.exports = User;
