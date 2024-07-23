import { Client, GatewayIntentBits, TextChannel } from 'discord.js';
import chalk from 'chalk';


const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.once('ready', async () => {
  console.log(`> Logged in as ${chalk.yellow.bold(client.user?.tag)}!`);
});

async function sendDiscordMessage(message: string, filePath: string) {
  try {
    const channel = await client.channels.fetch(process.env.DiscordChannelID!) as TextChannel;
    await channel.send({ content: message, files: [filePath] });
    console.log(`File sent successfully to ${channel.name}`);
  } catch (error) {
    console.error('Error sending message or file:', error);
  }
}

export { sendDiscordMessage, client };
