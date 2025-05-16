import express from 'express';
import { bot } from '../apps/bot.js';

const server = express();
server.use(express.json());
const PORT = process.env.PORT || 2999;
const URI = `/webhook/${process.env.BOT_TOKEN}`;
server.post(URI, async (req, res) => {
  try {
    console.log('Incoming update:', req.body);
    await bot.handleUpdate(req.body);
    res.status(200).send('ok');
  } catch (error) {
    console.error('Error handling update:', error);
    res.status(500).send('Internal Server Error');
  }
});

export const startServer = () => {
  server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on PORT ${PORT}`);
  });
};
