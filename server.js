const Discord = require('discord.js');
const client = new Discord.Client();
const fs = require('fs');
const db = require('quick.db');
const moment = require('moment')
require('moment-duration-format')
const commands = client.commands = new Discord.Collection();
const aliases = client.aliases = new Discord.Collection();

fs.readdirSync('./commands', { encoding: 'utf8' }).filter(file => file.endsWith(".js")).forEach((files) => {
    let command = require(`./commands/${files}`);
    if (!command.name) return console.log(`Hatalı Kod Dosyası => [/commands/${files}]`)
    commands.set(command.name, command);
    if (!command.aliases || command.aliases.length < 1) return
    command.aliases.forEach((otherUses) => { aliases.set(otherUses, command.name); })
})



//  WATCHING  : !ping izliyor
//  LISTENING : !ping dinliyor
//  PLAYING   : !ping oynuyor 
//  STREAMING : !ping yayında
////----------------------- READY KISMI -----------------------\\\\
client.on('ready', () => {
    client.user.setPresence({ activity: { name: 'No Mercy ♥ Suny' }, status: 'online' })
    client.channels.cache.get('814587197939777546').join() // ses kanalı İD
    console.log(`Bot ${client.user.tag} Adı İle Giriş Yaptı!`);
  })
////----------------------- CONFIG KISMI -----------------------\\\\
client.config = {
    vipRoles: ['814513382659981353'], //vip
    unregisteres: ['814541519293513809'], // kayıtsız
    maleRoles: ['814482237814603826','814482239411716106'], // erkek
    girlroles: ['814482237075619900','814482238490148904'], // bayan
    mods: ["814482230570516540","814482229581447192"], // yetkili
    channelID: '801134970806206524', // kayıt kanalı
    yönetim: ['814482224136323092','814482224769663046'] // üst yönetim
}
////----------------------- PREFİX KISMI -----------------------\\\\
client.on('message', message => {
    const prefix = ".";// prefix
    if (!message.guild || message.author.bot || !message.content.startsWith(prefix)) return;
    const args = message.content.slice(1).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
    const cmd = client.commands.get(command) || client.commands.get(client.aliases.get(command))
    if (!cmd) return;
    cmd.run(client, message, args)
})
////----------------------- HEM ETİKET HEMDE TAG ROL KISMI -----------------------\\\\
client.on("userUpdate", async function(oldUser, newUser) { 
    const guildID = "813401867920474153"//sunucu
    const roleID = ["814486009500532766","814482237075619900","814482238490148904","814482237814603826","814482239411716106"]//taglırolü
    const tag = ["suny","Suny"]//tag
    const chat = '801134970806206524'// chat
    const log2 = '801134970806206524' // log kanalı
  
    const guild = client.guilds.cache.get(guildID)
    const role = guild.roles.cache.find(roleInfo => roleInfo.id === roleID)
    const member = guild.members.cache.get(newUser.id)
    const embed = new Discord.MessageEmbed().setAuthor(member.displayName, member.user.avatarURL({ dynamic: true })).setColor('#ff0000').setTimestamp();
    if (newUser.username !== oldUser.username) {
        if (oldUser.username.includes(tag) && !newUser.username.includes(tag)) {
            member.roles.remove(roleID)
            client.channels.cache.get(log2).send(embed.setDescription(` ${newUser} isminden \`Suny\` çıakrtarak ailemizden ayrıldı!`))
        } else if (!oldUser.username.includes(tag) && newUser.username.includes(tag)) {
            member.roles.add(roleID)
            client.channels.cache.get(chat).send(`<a:suny_hactutanel:814591440747364372> Tebrikler, ${newUser} tag alarak ailemize katıldı ! \`(${tag})\``)
            client.channels.cache.get(log2).send(embed.setDescription(`  ${newUser} ismine \`Suny\` alarak ailemize katıldı`))
        }
    }
   if (newUser.discriminator !== oldUser.discriminator) {
        if (oldUser.discriminator == "1900" && newUser.discriminator !== "1900") {
            member.roles.remove(roleID)
            client.channels.cache.get(log2).send(embed.setDescription(`  <@!' + newUser + '> etiketinden \`1900\` çıakrtarak ailemizden ayrıldı!`))
        } else if (oldUser.discriminator !== "1900" && newUser.discriminator == "1900") {
            member.roles.add(roleID)
            client.channels.cache.get(log2).send(embed.setDescription(`  <@!' + newUser + '> etiketine \`1900\` alarak ailemize katıldı`))
            client.channels.cache.get(chat).send(`<a:suny_pentagram:814591505075404850> Tebrikler, ${newUser} tag alarak ailemize katıldı ! \`(#1900)\``)
        }
    }
  
  })

////----------------------- TAG TARAMASI KISMI -----------------------\\\\
setInterval(() => {
    const server = client.guilds.cache.get("813401867920474153"); //Server ID 
    server.members.cache.forEach(async member => {
        if (member.roles.cache.has("814513382659981353") || member.roles.cache.has("814501777922850837")) return; //VİP&BOOSTER ROL İD

/*   Yasaklı Tag    
   if(member.user.username.includes("tasaklıTAG")){
        member.roles.set(["814541519293513809"]).catch(() => {}) 
    }*/


 if (member.user.username.includes("suny")) {
            await member.roles.add("814541519293513809").catch(() => {})
        }
        if (!member.user.username.includes("suny")) {
            await member.roles.set("kayıtsız rolü")
        }
    })
}, 60 * 1000)// 60(60 saniye) kısmını değiştirebilirsiniz

client.login('NzQ5NjI0NTU3ODUzNDc0ODY2.X0usRQ.qsHaob0TlCm5jxxzN4IDv8vxMbY')//token