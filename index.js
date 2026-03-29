require('dotenv').config();
const app = require('./src/app');
const initializeDatabase = require('./src/config/initDb');

const PORT = process.env.PORT || 3000;

(async () => {
  try {
    // Initialiser la base de données
    await initializeDatabase();

    // Démarrer le serveur
    app.listen(PORT, () => {
      console.log(`✓ Server running on port ${PORT}`);
      console.log(`✓ Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`✓ API available at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('✗ Failed to start server:', error);
    process.exit(1);
  }
})();
