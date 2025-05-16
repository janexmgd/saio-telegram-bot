export default function (bot) {
  bot.command('start', async (ctx) => {
    const userid = ctx.from.id;
    ctx.reply('hello world ' + userid);
  });
}
