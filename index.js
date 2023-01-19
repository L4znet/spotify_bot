const { Client, GatewayIntentBits, Guild} = require('discord.js')
const ytdl = require('ytdl-core');
require('dotenv').config({path:'./.env'})
const SpotifyResolver = require('spotify-resolve');
const { joinVoiceChannel, getVoiceConnection, createAudioResource, createAudioPlayer} = require('@discordjs/voice');

const prefix = "!play"

const client = new Client({ intents: [
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildBans,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,] });
client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});




client.on("messageCreate", async (message) => {

    const Guild = client.guilds.cache.get(message.guildId); // Getting the guild.
    const Member = Guild.members.cache.get(message.author.id); // Getting the member.
    if (message.content.startsWith(prefix)) {
        // On vérifie si l'utilisateur a fourni un lien YouTube ou Spotify
        const url = message.content.split(' ')[1];
        if (!url) {
            return message.channel.send('Vous devez fournir un lien YouTube ou Spotify !');
        }


        if (!message.member.voice.channelId) {
            return message.reply('please join a voice channel first!');
        } else {

            joinVoiceChannel({
                channelId: message.member.voice.channelId,
                guildId: message.member.guild.id,
                adapterCreator: client.guilds.cache.get(message.member.guild.id).voiceAdapterCreator
            })


            if (url.startsWith('https://www.youtube.com/')) {
                const stream = ytdl(url, {filter: 'audioonly'});
                const player = createAudioPlayer();
                const connection = getVoiceConnection(message.member.guild.id);
                const resource =
                    createAudioResource(stream, {
                        inlineVolume: true
                    })
                player.play(resource)
                connection.subscribe(player)
            }
        }
    }


});
client.login(process.env.TOKEN);




/*
if (url.startsWith('https://open.spotify.com/')) {
    // C'est un lien Spotify, on résout le lien en utilisant spotify-uri-resolver
    try {
        const trackInfo = await SpotifyResolver(url);
        // On joue la musique à partir du lien résolu
        const stream = ytdl(trackInfo.url, { filter: 'audioonly' });
        const dispatcher = connection.play(stream);

        dispatcher.on('finish', () => {
            // Quand la musique est terminée, on quitte le channel vocal
            message.member.voice.channel.leave();
        });
    } catch (error) {
        console.error(error);
        message.channel.send('Erreur lors de la résolution du lien Spotify !');
    }
}
else if (url.startsWith('https://www.youtube.com/')) {

    console.log("sfdsfdfd")
    // C'est un lien YouTube, on joue la musique directement
    const stream = ytdl(url, { filter: 'audioonly' });
    const dispatcher = connection.play(stream);

    dispatcher.on('finish', () => {
        // Quand la musique est terminée, on quitte le channel vocal
        message.member.voice.channel.leave();
    });
}

*/



        // message.reply("Hey!")







