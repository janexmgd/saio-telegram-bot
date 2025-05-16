import axios from 'axios';
import { PassThrough } from 'stream';
import delay from 'delay';
const tiktokProcessing = async (ctx) => {
  try {
    const userAgent =
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36';
    const { API_URL } = process.env;
    const tiktokUrl = ctx.message.text;

    // Mengambil data TikTok
    const { data } = await axios.post(
      `${API_URL}/service`,
      { url: tiktokUrl },
      {
        headers: {
          Accept: '*/*',
          'Content-Type': 'application/json',
          'x-user-agent': userAgent,
        },
      }
    );

    const responseData = data.data;
    const idleMessage = await ctx.reply(`Downloading ${tiktokUrl}`);

    if (responseData.type === 'video') {
      const videoUrl = responseData.content.video.playAddr;
      const response = await axios({
        url: `${API_URL}/tunnel`,
        method: 'post',
        data: { url: videoUrl },
        responseType: 'stream',
        headers: {
          'Content-Type': 'application/json',
          'x-cookie': responseData.cookie,
          'x-user-agent': userAgent,
        },
      });

      const totalLength = response.headers['content-length'];
      let downloaded = 0;

      const passThroughStream = new PassThrough();
      response.data.on('data', (chunk) => {
        downloaded += chunk.length;
        const progress = totalLength
          ? ((downloaded / totalLength) * 100).toFixed(2)
          : null;

        if (progress && Math.floor(progress) % 10 === 0) {
          ctx.telegram.editMessageText(
            ctx.chat.id,
            idleMessage.message_id,
            null,
            `Stream progress ${progress}`
          );
        }
        passThroughStream.write(chunk);
      });
      await delay(1000);
      response.data.on('end', async () => {
        await ctx.telegram.deleteMessage(ctx.chat.id, idleMessage.message_id);
        passThroughStream.end();
        await ctx.replyWithVideo(
          { source: passThroughStream },
          { caption: 'Here is your TikTok video!' }
        );
      });

      response.data.on('error', (err) => {
        console.error('Error streaming video:', err);
        passThroughStream.destroy(err);
        throw err;
      });
    } else {
      await ctx.reply('The provided URL does not contain a video.');
    }
  } catch (error) {
    console.error('Error processing TikTok:', error);
    await ctx.reply(
      'An error occurred while processing the TikTok URL. Please try again.'
    );
  }
};

export default tiktokProcessing;
