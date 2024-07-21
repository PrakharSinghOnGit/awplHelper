import { Client, GatewayIntentBits, TextChannel } from 'discord.js';
import { env } from 'bun';
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

async function getDiscordChannel(client: Client, channelId: string): Promise<TextChannel | null> {
  const channel = client.channels.cache.get(channelId) as TextChannel | undefined;
  return channel ?? null; // Use nullish coalescing for cleaner null handling
}

async function sendDiscordMessage(channel: TextChannel, message: string, filePath: string) {
  try {
    await channel.send({ content: message, files: [filePath] });
    console.log(`File sent successfully to ${channel.name}`);
  } catch (error) {
    console.error('Error sending message or file:', error);
  }
}

client.login(env.DiscordToken);

export { sendDiscordMessage, getDiscordChannel,client };
