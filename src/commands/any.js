import tiktokProcessing from '../processing/tiktok.js';

const tiktokFormatUrls = [
  /^https:\/\/vt\.tiktok\.com\/[A-Za-z0-9]+\/?$/,
  /^https:\/\/www\.tiktok\.com\/@([A-Za-z0-9_.]+)\/video\/(\d+)\/?$/,
  /^https:\/\/www\.tiktok\.com\/@([A-Za-z0-9_.]+)\/photo\/(\d+)\/?$/,
];
export default function (bot) {
  bot.on('text', async (ctx, next) => {
    const messageText = ctx.message.text;

    if (tiktokFormatUrls.some((pattern) => pattern.test(messageText))) {
      await tiktokProcessing(ctx);
    }
  });
}
