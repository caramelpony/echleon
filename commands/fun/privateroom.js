const {getMember, warningEmbed, formatDate, getUserDomain, getGuildDomain} =
    require("../../functions.js");

module.exports = {
  name : "privateroom",
  aliases : [ "pr", "pm", "room" ],
  category : "fun",
  description : "Creates a private chat room.",
  usage : "pr <new | delete | invite | kick> [username | id | mention]",
  run : async (client, message, args) => {
    (async () => {
      // Simplify "message.guild" to server.
      var server = message.guild;

      // Find category in which to parent all of the private channels.
      let category = server.channels.find(c => c.name == "Private Channels" &&
                                               c.type == "category");

      // Find mentioned/target member for command.
      const member = getMember(message);

      // Random String function
      function randomString(length, chars) {
        var mask = '';
        if (chars.indexOf('a') > -1)
          mask += 'abcdefghijklmnopqrstuvwxyz';
        if (chars.indexOf('#') > -1)
          mask += '0123456789';
        var result = '';
        for (var i = length; i > 0; --i)
          result += mask[Math.floor(Math.random() * mask.length)];
        return result;
      }

      // Prevent command being used without category.
      if (!category) {
        return message.channel
            .send(warningEmbed(
                client,
                "No category called `Private Channels`. Please ask a server admin to fix this."))
            .then(m => m.delete(5000));
      }

      // Make sure that the subcommands are used.
      if (args.length < 1) {
        return message.channel
            .send(warningEmbed(
                client, "Please pick a command! See `=help pr` for more."))
            .then(m => m.delete(5000));
      }

      // Long ElseIf chain to determine what to do.
      // We start with the creation command.
      if (args[0] == "new" || args[0] == "n" || args[0] == "create" ||
          args[0] == "c") {
        var roominstance = `${randomString(6, '#a')}`;
        var tempRoomName = `${getUserDomain(member)}-${roominstance}`;
        var roomname = tempRoomName.toLowerCase();

        // Because we're allowing the command to be used such as
        // "=pr @CaramelDrop", we need to assign the role to both users, so they
        // can both enter chat.

        // Create Role
        await message.guild
            .createRole({
              // Role Settings
              name : roomname,
              permissions : []
            },
                        "Created private role.")
            .then(role => {
              member.addRole(role, "Assigned private role.")
                  .catch(error => client.catch(error));
              // Determine if the user provided is the message author.
              if (message.author.id != member.user.id) {
                // Assign role accordingly.
                message.member.addRole(role, "Assigned private role.")
                    .catch(error => client.catch(error));
              }
            })
            .catch(error => client.catch(error));

        // Create Channel
        server.createChannel(roomname, 'text')
            .then( // Create the actual text channel.
                (chan) => {
                  // Take the newly create channel "chan" and assign it to the
                  // proper category.
                  chan.setParent(category.id)
                      .then( // Move the text channel to the category.
                          (chan2) => {
                            // Modify the newly moved channel.
                            console.log("Private room created and moved.");
                            chan2.overwritePermissions(
                                message.guild.roles.find('name', '@everyone'), {
                                  'READ_MESSAGES' : false,
                                }); // Give the channel some standard
                                    // permissions.
                            chan2.overwritePermissions(
                                message.guild.roles.find('name', roomname), {
                                  'CREATE_INSTANT_INVITE' : false,
                                  'ADD_REACTIONS' : true,
                                  'READ_MESSAGES' : true,
                                  'SEND_MESSAGES' : true,
                                  'SEND_TTS_MESSAGES' : false,
                                  'MANAGE_MESSAGES' : true,
                                  'MANAGE_CHANNEL' : false,
                                  'EMBED_LINKS' : true,
                                  'ATTACH_FILES' : true,
                                  'READ_MESSAGE_HISTORY' : true,
                                  'MENTION_EVERYONE' : true,
                                  'EXTERNAL_EMOJIS' : true
                                });
                            chan2
                                .send(warningEmbed(
                                    client,
                                    "Remeber, admins can see your private chat!"))
                                .then(m => m.delete(60000));
                          })
                      .catch(console.error);
                })
            .catch(console.error);
      } else if (args[0] == "delete" || args[0] == "d" || args[0] == "del") {
        // First we must determine the channel to delete.
        // Easiest way is to have the user type the command from the channel.
        if (message.channel.parent != category) {
          return message.channel
              .send(warningEmbed(
                  client,
                  "Please execute this command in the channel you're trying to delete."))
              .then(m => m.delete(5000));
        }

        if (message.channel.parent == category &&
            message.channel.parent.name == "Private Channels") {
          return message.channel
              .send(warningEmbed(
                  client,
                  "Please execute this command in the channel you're trying to delete."))
              .then(m => m.delete(5000));
        }

        // We now proceed to delete the ***role first*** then the channel, on a
        // delay. Role is deleted first for simplicity's sake.
        function deleteChannel() {
          server.roles.find(role => role.name === message.channel.name)
              .delete();
          message.channel.delete();
        }
        message.channel.send(warningEmbed(
            client,
            `${
                member.user
                    .username} has requested this channel be deleted! ***60*** seconds remaining until deletion. This can not be cancelled.`));
        setTimeout(deleteChannel, 60000);
      } else if (args[0] == "invite" || args[0] == "i" || args[0] == "inv") {
        // Make sure that command is being executed in the target channel.
        if (message.channel.parent != category) {
          return message.channel
              .send(warningEmbed(
                  client,
                  "Please execute this command in the channel you're trying to invite someone to."))
              .then(m => m.delete(5000));
        }
        // Determine if there's a user to invite.
        if (args.length < 2) {
          return message.channel
              .send(warningEmbed(client, "Please mention a user to invite!"))
              .then(m => m.delete(5000));
        }
        // Determine user.
        function findInvitee(targetMember) {

          if (message.mentions.members) {
            target = message.mentions.members.first();
          } else {
            return message.channel
                .send(warningEmbed(
                    client,
                    "Please mention a user (e.g. `@Echleon`) to invite! "))
                .then(m => m.delete(5000));
          }

          return target;
        }
        // Identify user.
        let foundMember = findInvitee(client, args[1]);
        // Identify role.
        let foundRole =
            server.roles.find(role => role.name === message.channel.name);
        // Add role to the aforementioned user.
        if (foundMember != null) {
          foundMember.addRole(foundRole, "Assigned private role.")
              .catch(error => console.log(error));
        } else {
          // Unknown Error. Don't really know why this would fail. Don't care
          // to.
          return message.channel.send(warningEmbed(client, "Unkown Error!"))
              .then(m => m.delete(5000));
        }
      } else if (args[0] == "kick" || args[0] == "k" || args[0] == "remove" ||
                 args[0] == "r" || args[0] == "rem") {
        // Make sure that command is being executed in the target channel.//
        // Make
        if (message.channel.parent != category) {
          return message.channel
              .send(warningEmbed(
                  client,
                  "Please execute this command in the channel you're trying to kick someone from."))
              .then(m => m.delete(5000));
        }
        // Make sure command is targetting user.
        if (args.length < 2) {
          return message.channel
              .send(warningEmbed(client, "Please mention a user to kick!"))
              .then(m => m.delete(5000));
        }
        // Locate user.
        function findInvitee(targetMember) {

          if (message.mentions.members) {
            target = message.mentions.members.first();
          } else {
            return message.channel
                .send(warningEmbed(
                    client,
                    "Please mention a user (e.g. `@Echleon`) to kick! "))
                .then(m => m.delete(5000));
          }

          return target;
        }
        // Identify user.
        let foundMember = findInvitee(client, args[1]);
        // Identify role.
        let foundRole =
            server.roles.find(role => role.name === message.channel.name);
        // Remove role, hence kicking the user.
        if (foundMember != null) {
          foundMember.removeRole(foundRole, "Removed private role.")
              .catch(error => console.log(error));
        } else {
          return message.channel.send(warningEmbed(client, "Unkown Error!"))
              .then(m => m.delete(5000));
        }
      } else {
        message.channel
            .send(warningEmbed(
                client,
                "Please pick a valid command! See `=help pr` for more."))
            .then(m => m.delete(5000));
      }

      if (message.deletable)
        message.delete();
    })();
  }
}
