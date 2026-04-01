const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER,           // 'glucosen_user'
  host: process.env.DB_HOST,           // 'localhost'
  database: process.env.DB_NAME,      // 'glucosen_db'
  password: process.env.DB_PASSWORD,  // 'your_secure_password'
  port: process.env.DB_PORT || 5432,
  // Si tu veux, tu peux ajouter :
  // ssl: process.env.DB_SSL === 'true',
});

pool.on('error', (err) => {
  console.error('Erreur de connexion PostgreSQL', err);
  process.exit(-1);
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};
