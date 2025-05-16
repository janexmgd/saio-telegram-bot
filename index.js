import { startServer } from './src/api/api.js';
import { startBot } from './src/apps/bot.js';
import 'dotenv/config';

const main = async () => {
  try {
    process.stdout.write('\x1Bc');
    await startBot();
    if (process.env.NODE_ENV == 'PRODUCTION') {
      console.log('production');

      startServer();
    } else {
      console.log('Running in development mode, server not started.');
    }
  } catch (error) {
    console.log('error starting bot');

    console.log(error);
  }
};

main().catch((error) => {
  console.error('Error starting application:', error);
});
