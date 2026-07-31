const app = require('./app');
const connectDB = require('./config/db');
const { port, nodeEnv } = require('./config/env');

async function startServer() {
  try {
    await connectDB();

    app.listen(port, () => {
      console.log(`Server running on port ${port} (${nodeEnv})`);
      console.log(`Swagger: http://localhost:${port}/api-docs`);
    });
  } catch (error) {
    console.error('Startup failed:', error.message);
    process.exit(1);
  }
}

startServer();
