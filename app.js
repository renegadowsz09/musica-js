var opus = require('opusscript');

const Discord = require('discord.js');

const Util = require('discord.js');

const ffmpeg = require('ffmpeg');


const getYoutubeID = require('get-youtube-id');

const fetchVideoInfo = require('youtube-info');

const YouTube = require('simple-youtube-api');

const youtube = new YouTube("API_URL");

const queue = new Map();

const ytdl = require('ytdl-core');

const fs = require('fs');

const gif = require("gif-search");



const client = new Discord.Client({disableEveryone: true});

const prefix = "";
/////////////////////////
////////////////////////
client.on("ready", () => {
	console.log(`Bot foi iniciado, com ${client.users.size} usuários, em ${client.channels.size} canais, em ${client.guilds.size} servidores.`); 
	 
  });
  
  
  function changingstatus() {
	let status = [`K`  , `K`, `K`, `K`]
	let random = status[Math.floor(Math.random() * status.length)]
	client.user.setActivity(random, { url: 'https://www.twitch.tv/NãoTenhoTwitch', type: "LISTENING"})
  }
  
  client.on("ready", () => {
	console.log( `Fui iniciada!` );
	setInterval(changingstatus, 10000);
  });
  




client.on('message', async msg =>{
	if (msg.author.bot) return undefined;
    if (!msg.content.startsWith(prefix)) return undefined;
    
    let args = msg.content.split(' ');

	let command = msg.content.toLowerCase().split(" ")[0];
	command = command.slice(prefix.length)

	

	
   
});
/////////////////////////
////////////////////////
//////////////////////
client.on('message', async msg =>{
	if (msg.author.bot) return undefined;
    if (!msg.content.startsWith(prefix)) return undefined;
    
    let args = msg.content.split(' ');

	let command = msg.content.toLowerCase().split(" ")[0];
	command = command.slice(prefix.length)

})
/////////////////////////
////////////////////////
//////////////////////
/////////////////////////
////////////////////////
//////////////////////

/////////////////////////
////////////////////////
//////////////////////
/////////////////////////
////////////////////////
//////////////////////
client.on('message', async msg => { 
	if (msg.author.bot) return undefined;
    if (!msg.content.startsWith(prefix)) return undefined;
    
    const args = msg.content.split(' ');
	const searchString = args.slice(1).join(' ');
    
	const url = args[1] ? args[1].replace(/<(.+)>/g, '$1') : '';
	const serverQueue = queue.get(msg.guild.id);

	let command = msg.content.toLowerCase().split(" ")[0];
	command = command.slice(prefix.length)

	if (command === `play`) {
		const voiceChannel = msg.member.voiceChannel;
        
        if (!voiceChannel) return msg.channel.send("<:cancel:504782695667335178>Não consigo encontrar você em nenhum canal de voz!");
        
        const permissions = voiceChannel.permissionsFor(msg.client.user);
        
        if (!permissions.has('CONNECT')) {

			return msg.channel.send("<:cancel:504782695667335178>Não tenho permissões suficientes para entrar no seu canal de voz!");
        }
        
		if (!permissions.has('SPEAK')) {

			return msg.channel.send("<:cancel:504782695667335178>Não tenho permissões suficientes para falar no seu canal de voz!");
		}

		if (!permissions.has('EMBED_LINKS')) {

			return msg.channel.sendMessage("<:cancel:504782695667335178>Eu não tenho permissões suficientes para inserir URLs!")
		}

		if (url.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)) {

			const playlist = await youtube.getPlaylist(url);
            const videos = await playlist.getVideos();
            

			for (const video of Object.values(videos)) {
                
                const video2 = await youtube.getVideoByID(video.id); 
                await handleVideo(video2, msg, voiceChannel, true); 
            }
			return msg.channel.send(`<:play2:504783312632676372>**${playlist.title}**, Apenas adicionado à fila!`);
		} else {

			try {

                var video = await youtube.getVideo(url);
                
			} catch (error) {
				try {

					var videos = await youtube.searchVideos(searchString, 5);
					let index = 0;
                    const embed1 = new Discord.RichEmbed()
                    .setTitle("<:search:504784939712249857>	:mag_right: Resultados do Youtube :")
                    .setDescription(`
                    ${videos.map(video2 => `${++index}. **${video2.title}**`).join('\n')}`)
                    
					.setColor("#f7abab")
					msg.channel.sendEmbed(embed1).then(message =>{message.delete(20000)})
					
/////////////////					
					try {

						var response = await msg.channel.awaitMessages(msg2 => msg2.content > 0 && msg2.content < 11, {
							maxMatches: 1,
							time: 15000,
							errors: ['time']
						});
					} catch (err) {
						console.error(err);
						return msg.channel.send('<:shuffle:508114778695139348>Ninguém respondeu um número !!');
                    }
                    
					const videoIndex = parseInt(response.first().content);
                    var video = await youtube.getVideoByID(videos[videoIndex - 1].id);
                    
				} catch (err) {

					console.error(err);
					return msg.channel.send("<:ca:518226009716162561>Não encontrei nenhum resultado!");
				}
			}

            return handleVideo(video, msg, voiceChannel);
            
        }
        
	} else if (command === `skip`) {

		if (!msg.member.voiceChannel) return msg.channel.send("<:conec:504763227197145088>Você deve estar em um canal de voz para executar os comandos de música!");
        if (!serverQueue) return msg.channel.send("<:cancel:504782695667335178>Não há fila para pular !!");

		serverQueue.connection.dispatcher.end('<:skip:514872968908636168>Ok, pulado!');
        return undefined;
        
	} else if (command === `stop`) {

		if (!msg.member.voiceChannel) return msg.channel.send("<:conec:504763227197145088Você deve estar em um canal de voz para executar os comandos de música!");
        if (!serverQueue) return msg.channel.send("<:cancel:504782695667335178>Não há fila para pular !!");
        
		serverQueue.songs = [];
		serverQueue.connection.dispatcher.end('<:pause:504769144466702387>Ok, parou e desconectou do seu canal de voz');
        return undefined;
        
	} else if (command === `vol`) {

		if (!msg.member.voiceChannel) return msg.channel.send("<:conec:504763227197145088>Você deve estar em um canal de voz para executar os comandos de música!");
		if (!serverQueue) return msg.channel.send('<:on:505048258041872385>Você só pode usar este comando enquanto a música está tocando!');
        if (!args[1]) return msg.channel.send(`<:s3:504792864723566622>O volume do bot é **${serverQueue.volume}**`);
        
		serverQueue.volume = args[1];
        serverQueue.connection.dispatcher.setVolumeLogarithmic(args[1] / 50);
        
        return msg.channel.send(`<:s2:504792851352125464>O volume agora é **${args[1]}**`);

	} else if (command === `np`) {

		if (!serverQueue) return msg.channel.send('<:cancel:504782695667335178>Não há fila!');
		const embedNP = new Discord.RichEmbed()
	    .setDescription(`<:headphones:504788716473155594>Está tocando: **${serverQueue.songs[0].title}**`)
        return msg.channel.sendEmbed(embedNP);
        
	} else if (command === `queue`) {
		
		if (!serverQueue) return msg.channel.send('<:cancel:504782695667335178>Não há fila!');
//	//	//
		const embedqu = new Discord.RichEmbed()
        .setTitle("Músicas que estão na fila!")
        .setDescription(`
        ${serverQueue.songs.map(song => `${++index}. **${song.title}**`).join('\n')}
**Está tocando:** **${serverQueue.songs[0].title}**`)
        .setColor("#f7abab")
		return msg.channel.sendEmbed(embedqu);
	} else if (command === `pause`) {
		if (serverQueue && serverQueue.playing) {
			serverQueue.playing = false;
			serverQueue.connection.dispatcher.pause();
			return msg.channel.send('<:pause:504769144466702387>Ok, pausado!');
		}
		return msg.channel.send('Não há nada para pular!');
	} else if (command === "resume") {

		if (serverQueue && !serverQueue.playing) {
			serverQueue.playing = true;
			serverQueue.connection.dispatcher.resume();
            return msg.channel.send('<:play:504769095586152448>Ok, resumido!');
            
		}
		return msg.channel.send('Lista está vazia!');
	}

	return undefined;
});

async function handleVideo(video, msg, voiceChannel, playlist = false) {
	const serverQueue = queue.get(msg.guild.id);
	console.log(video);
	

	const song = {
		id: video.id,
		title: Util.escapeMarkdown(video.title),
		url: `https://www.youtube.com/watch?v=${video.id}`
	};
	if (!serverQueue) {
		const queueConstruct = {
			textChannel: msg.channel,
			voiceChannel: voiceChannel,
			connection: null,
			songs: [],
			volume: 5,
			playing: true
		};
		queue.set(msg.guild.id, queueConstruct);

		queueConstruct.songs.push(song);

		try {
			var connection = await voiceChannel.join();
			queueConstruct.connection = connection;
			play(msg.guild, queueConstruct.songs[0]);
		} catch (error) {
			console.error(`<:alarm:530882071808442399>Eu não pude entrar no canal de voz: ${error}!`);
			queue.delete(msg.guild.id);
			return msg.channel.send(`<:alarm:530882071808442399>Não pode participar deste canal:${error}!`);
		}
	} else {
		serverQueue.songs.push(song);
		console.log(serverQueue.songs);
		if (playlist) return undefined;
		else return msg.channel.send(`**<:play:504769095586152448>${song.title}**, acabou de adicionar à fila! `);
	} 
	return undefined;
}

function play(guild, song) {
	const serverQueue = queue.get(guild.id);

	if (!song) {
		serverQueue.voiceChannel.leave();
		queue.delete(guild.id);
		return;
	}
	console.log(serverQueue.songs);

	const dispatcher = serverQueue.connection.playStream(ytdl(song.url))
		.on('end', reason => {
			if (reason === 'O fluxo não está gerando com rapidez suficiente.') console.log('Som acabado.');
			else console.log(reason);
			serverQueue.songs.shift();
			play(guild, serverQueue.songs[0]);
		})
		.on('error', error => console.error(error));
	dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);

	serverQueue.textChannel.send(`<:playlist:504769122232434696>**${song.title}**, Está tocando`);
}





    


client.login('token-aqui');
