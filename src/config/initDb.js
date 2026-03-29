const pool = require('./database');

const initializeDatabase = async () => {
  try {
    // Create users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        first_name VARCHAR(255),
        last_name VARCHAR(255),
        date_of_birth DATE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create glucose readings table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS glucose_readings (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        glucose_level DECIMAL(10, 2) NOT NULL,
        unit VARCHAR(10) DEFAULT 'mg/dL',
        notes TEXT,
        reading_time TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
      );
    `);

    // Create meals table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS meals (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        meal_type VARCHAR(50),
        description TEXT,
        carbs INTEGER,
        protein INTEGER,
        fat INTEGER,
        calories INTEGER,
        meal_time TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );
    `);

    // Create insulin logs table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS insulin_logs (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        insulin_type VARCHAR(100),
        units DECIMAL(10, 2),
        administration_time TIMESTAMP NOT NULL,
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );
    `);

    // Create exercise logs table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS exercise_logs (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        activity_type VARCHAR(100),
        duration_minutes INTEGER,
        intensity VARCHAR(50),
        calories_burned INTEGER,
        exercise_time TIMESTAMP NOT NULL,
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );
    `);

    // Create indexes
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_glucose_user_id ON glucose_readings(user_id);`);
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_glucose_reading_time ON glucose_readings(reading_time DESC);`);
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_meals_user_id ON meals(user_id);`);
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_insulin_user_id ON insulin_logs(user_id);`);
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_exercise_user_id ON exercise_logs(user_id);`);

    console.log('✓ Database initialized successfully');
  } catch (error) {
    console.error('✗ Error initializing database:', error);
    throw error;
  }
};

module.exports = initializeDatabase;
