const { RichEmbed, MessageAttachment } = require("discord.js");
const { stripIndents } = require("common-tags");
const { getMember, warningEmbed, formatDate, checkUserData, getGuildDomain, getUserDomain} = require("../../functions.js");
const fs = require('fs')
const { createCanvas, loadImage } = require('canvas')

const { fillTextWithTwemoji } = require('node-canvas-with-twemoji');

const Owner = require('../../models/owner');
const User = require('../../models/user');
const Guild = require('../../models/guild');


module.exports = {
    name: "card",
    category: "fun",
    description: "Returns user information",
    usage: "[username | id | mention]",
    run: (client, message, args) => {
        (async () => {
          const member = getMember(message, args.join(' '));
          var memberID = member.user.id;

          
          // Member variables
          const joined = formatDate(member.joinedAt);
          const roles = member.roles
              .filter(r => r.id !== message.guild.id)
              .map(r => r).join(", ") || 'none';

          // User variables
          const created = formatDate(member.user.createdAt);
          const avatar = member.user.displayAvatarURL;

          function roundRect(ctx, x, y, width, height, radius, fill, stroke) {
              if (typeof stroke === 'undefined') {
                stroke = true;
              }
              if (typeof radius === 'undefined') {
                radius = 5;
              }
              if (typeof radius === 'number') {
                radius = {tl: radius, tr: radius, br: radius, bl: radius};
              } else {
                var defaultRadius = {tl: 0, tr: 0, br: 0, bl: 0};
                for (var side in defaultRadius) {
                  radius[side] = radius[side] || defaultRadius[side];
                }
              }
              ctx.beginPath();
              ctx.moveTo(x + radius.tl, y);
              ctx.lineTo(x + width - radius.tr, y);
              ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
              ctx.lineTo(x + width, y + height - radius.br);
              ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
              ctx.lineTo(x + radius.bl, y + height);
              ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
              ctx.lineTo(x, y + radius.tl);
              ctx.quadraticCurveTo(x, y, x + radius.tl, y);
              ctx.closePath();
              if (fill) {
                ctx.fill();
              }
              if (stroke) {
                ctx.stroke();
              }
            
          }

            const exampleEmbed = new RichEmbed();

            const width = 1200;
            const height = 630;
            
            const canvas = createCanvas(width, height);
            const context = canvas.getContext('2d');

            // Creates the Card Shape
            
            context.fillStyle = '#23272A'
            roundRect(context, 10, 10, 1180, 610, 20, true, false);
            context.fillStyle = '#7289DA'
            roundRect(context, 10, 10, 1180, 30, 20, true, false);
            context.fillRect(10, 25, 1180, 15);


            // Draws User
            
            context.font = 'bold 70pt Arial';
            context.textAlign = 'left';
            context.textBaseline = 'top';
            context.fillStyle = '#7289DA';
            
            const textBeforeFomatting = member.user.username;
            var text = "";

            // Cut off username at " " or 10 chars

            if (textBeforeFomatting.length >= 11) {
              if (textBeforeFomatting.indexOf(" ") != -1 && textBeforeFomatting.indexOf(" ") <= 10) {
                text = textBeforeFomatting.substring(0,textBeforeFomatting.indexOf(" "));
              } else {
                text = textBeforeFomatting.substring(0,10);
              }
            } else {
              text = textBeforeFomatting;
            }
            const textX = 260;
            const textY = 80;
            
            const textWidth = context.measureText(text).width;
            context.fillRect(textX - 10, textY - 10, textWidth + 20, 120); // Seems to be 65 ahead of text on X
            context.fillStyle = '#fff';
            context.fillText(text, textX, textY);

            context.font = 'bold 50pt Arial';
            context.textAlign = 'left';
            context.textBaseline = 'top';
            context.fillStyle = '#99AAB5';
            
            const text2 = "#" + member.user.discriminator;
            const textX2 = 260;
            const textY2 = textY + 120 - 10;
            
            const textWidth2 = context.measureText(text2).width;
            context.fillRect(textX2 - 10, textY2, textWidth2 + 20, 80); // Seems to be 65 ahead of text on X
            context.fillStyle = '#fff';
            context.fillText(text2, textX2, textY2);
            
            // Renders user badges
            
            var badges = await checkUserData(client, member);
            if (badges.indexOf("👑") != -1)
              var botOwner = true;
            if (badges.indexOf("💻") != -1)
              var developer = true;
            if (badges.indexOf("💛") != -1)
              var sponsor = true;
            if (badges.indexOf("☑") != -1)
              var verified = true;
            console.log(badges);

            if (badges.length > 0) {
              var label = "";
              context.fillStyle = '#fff';
              context.textAlign = 'right';
              context.font = 'bold 35pt Arial';
              var posX = 1170;
              var posY = 80;
              for (var badge of badges){
                label = label + badge + " ";
              }
              await fillTextWithTwemoji(context, label, posX, posY);
            }
            
            if (botOwner == true){
              var label = "Lead Developer";
              context.font = 'bold 19pt Arial';
              context.textAlign = 'left';
              context.textBaseline = 'top';
              const labelWidth = context.measureText(label).width;
              context.fillStyle = '#a83fd1';
              var posX = 40;
              var posY = 280;
              roundRect(context, posX, posY, labelWidth + 16, 35, 5, true, false);
              context.fillStyle = '#fff';
              context.fillText(label, posX+8, posY+2);
            }
            

            // User Data Card

            context.fillStyle = '#60666e';
            context.fillRect(850, 40, 2, 580);
            getGuildDomain(message);
            
            // Creates the Footer
            context.textAlign = 'left';
            const footerText = `${getUserDomain(member)}@${getGuildDomain(message)}.echleon`;
            context.fillStyle = '#fff';
            context.font = 'bold 20pt Arial';
            context.fillText(footerText, 40, 550);

            // Adds the Profile Picture
            
            loadImage(avatar).then(profile => {
              context.drawImage(profile, 40, 70, 200, 200)
              const buffer = canvas.toBuffer('image/png')
              fs.writeFileSync(`./${memberID}.png`, buffer)
              // Send the attachment in the message channel with a content
              exampleEmbed.setTitle(`${member.user.username}'s Usercard:`)
                          .attachFiles([`./${memberID}.png`])
                          .setImage(`attachment://${memberID}.png`);
              var badgeLegend = "";
              if (botOwner == true)
                badgeLegend = badgeLegend + `👑 | ${member.user.username} is Echleon's Lead Developer.\n`;
              if (developer == true)
                badgeLegend = badgeLegend + `💻 | ${member.user.username} is an Echleon developer.\n`;
              if (sponsor == true)
                badgeLegend = badgeLegend + `💛 | ${member.user.username} is an Echleon sponsor.\n`;
              if (verified == true)
                badgeLegend = badgeLegend + `☑ | ${member.user.username} is a verified user.\n`;
              exampleEmbed.setDescription(badgeLegend);
              exampleEmbed.addField("Domain:", `${getUserDomain(member)}@${getGuildDomain(message)}.echleon`, true)
              message.channel.send(exampleEmbed).then(message => {
                try {
                  fs.unlinkSync(`./${memberID}.png`);
                } catch(err) {
                  console.error(err);
                }
              });
            
            })
        })(); 
          
          
    }
}
