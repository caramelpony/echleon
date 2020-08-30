const { RichEmbed, MessageAttachment } = require("discord.js");
const { stripIndents } = require("common-tags");
const { getMember, warningEmbed, formatDate } = require("../../functions.js");
const fs = require('fs')
const { createCanvas, loadImage } = require('canvas')


module.exports = {
    name: "card",
    category: "fun",
    description: "Returns user information",
    usage: "[username | id | mention]",
    run: (client, message, args) => {
        const member = getMember(message, args.join(' '));
        
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

          const exampleEmbed = new RichEmbed()

          const width = 1200
          const height = 630
          
          const canvas = createCanvas(width, height)
          const context = canvas.getContext('2d')
          
          context.fillStyle = '#23272A'
          roundRect(context, 10, 10, 1180, 610, 20, true);
          
          context.font = 'bold 70pt Arial'
          context.textAlign = 'left'
          context.textBaseline = 'top'
          context.fillStyle = '#7289DA'
          
          const text = member.user.username;
          const textX = 300;
          const textY = 60;
          
          const textWidth = context.measureText(text).width
          context.fillRect(textX - 10, textY - 10, textWidth + 20, 120) // Seems to be 65 ahead of text on X
          context.fillStyle = '#fff'
          context.fillText(text, textX, textY)


          context.font = 'bold 50pt Arial'
          context.textAlign = 'left'
          context.textBaseline = 'top'
          context.fillStyle = '#99AAB5'
          
          const text2 = "#" + member.user.discriminator;
          const textX2 = 300;
          const textY2 = textY + 120 - 10;
          
          const textWidth2 = context.measureText(text2).width
          context.fillRect(textX2 - 10, textY2, textWidth2 + 20, 80) // Seems to be 65 ahead of text on X
          context.fillStyle = '#fff'
          context.fillText(text2, textX2, textY2)
          
          context.fillStyle = '#fff'
          context.font = 'bold 30pt Arial'
          context.fillText('Echleon Info Card', 600, 530)
          
          loadImage(avatar).then(profile => {
            context.drawImage(profile, 50, 50, 200, 200)
            const buffer = canvas.toBuffer('image/png')
            fs.writeFileSync('./usercard.png', buffer)
            // Send the attachment in the message channel with a content
            exampleEmbed.setTitle(`${message.author.username}'s Usercard:`)
            exampleEmbed.attachFiles(['./usercard.png'])
            exampleEmbed.setImage('attachment://usercard.png');
            message.channel.send(exampleEmbed);
          })
          
          
          
    }
}
