# Echleon - Discord Server Analytics
## This Project is on hiatus and incomplete!
![GitHub package.json version](https://img.shields.io/github/package-json/v/solemcaelum/echleon) | ![GitHub issues](https://img.shields.io/github/issues/solemcaelum/echleon) | ![GitHub pull requests](https://img.shields.io/github/issues-pr/solemcaelum/echleon) | ![GitHub](https://img.shields.io/github/license/solemcaelum/echleon) | [![donate](https://img.shields.io/badge/donate-KoFi-blue.svg)](https://ko-fi.com/carameldrop) | [![BCH compliance](https://bettercodehub.com/edge/badge/solemcaelum/echleon?branch=master)](https://bettercodehub.com/)

An Open Source attempt to bring analytics into the process of running a Discord Server.

### About
A Discord bot that collects data and uses it to understand how a server is being run, what could be done to improve traffic/community, and educate the staff on Discord's lesser known features.

All Data collected by this bot will eventually be Opt-In, allowing more privacy-centric Discord Server owners to maintain trust with their communities, whilst encouraging the community's growth.

### Planned Features and To-Do
Most planned features should also appear on the Project page as well.
These aren't in any particular order, but will be moved to the top as they're finished.
- [x] | Move to RichEmbed for most bot Responses.
- [x] | Finish `canvas` implementation in order to allow Misc. "Profile Cards" feature.
- [ ] | Add Web Interface to allow for easier management of Server settings.
- [ ] | Add ability to send feedback to Developers from inside Bot/Web Interface.
- [ ] | Improve consistency, cleanup codebase, and **optimize**.
- [ ] | Implement Voice Support for music, and audio features.
- [ ] | Implement Auto-Moderation features.
- [ ] | Add option to anonymize/obfuscate user data.
- [ ] | Add option to enable/disable almost all Bot features.
- [ ] | Add Uptime Robot support for Uptime tracking.
- [ ] | Make bot cute?

### Dependencies
Kind of already outdated list, but you get the general premise.

* `ascii-table`: "0.0.9"
* `axios`: "^0.21.1"
* `bufferutil`: "^4.0.1"
* `canvas`: "^2.6.0"
* `common-tags`: "^1.8.0"
* `discord.js`: "^11.5.1"
* `dotenv`: "^8.2.0"
* `erlpack`: "^0.1.3"
* `express`: "^4.17.1"
* `libsodium-wrappers`: "^0.7.6"
* `moment`: "^2.24.0"
* `mongoose`: "^5.7.11"
* `mongoose-findorcreate`: "^3.0.0"
* `node-canvas-with-twemoji`: "^0.1.2"
* `node-opus`: "^0.3.3"
* `opusscript`: "0.0.7"
* `sodium`: "^3.0.2"
* `uws`: "^100.0.1"

### Requirements
MongoDB Server, and Node.JS (^10.17.0) pre-installed.

#### Get up and running
1. Clone the Repo to a folder of your choosing.
2. Open a console in the folder and enter `npm i` to install dependencies.
3. Create a `.env` file and provide your access details as described below.
4. Use `node app.js` to ensure that everything is running properly.
* If you're developing/contributing, considering installing `nodemon` and using the `npm test` script so your instance will restart upon file saves.

* If you're new to development, consider using Atom. It's a wonderful program and with the right set of addons, can work wonders for JavaScript developers old and new. It simplifies your workflow, keeps things organized, and is simple enough to move to from Notepad++.

* If you're looking to improve your workflow, consider using VSCode on MacOS :)

#### Example `.env` File
```env
FILLYTOKEN="Discord Token Goes Here"
OWNER="Your Discord ID"
MONGO_CONNECT="mongodb+srv://username:password@hostname:port"
```

### Contributing
At the current moment in time, I don't have a set in stone method of accepting anyone's help. I'm new to Github still, fleshing out the basis of this bot, and working solo.

However, if you'd like to submit a Pull Request, I can look it over and merge it if all looks well. Feel free to rename almost any variable, except for my `.env` ones, and if you make any major changes, please provide a written explanation with your PR!

### Supporting
If you like the bot, like the idea, or just want to help out, I'm accepting donations and will use almost all income from them to spend more time working on this and other open source projects.

[![ko-fi](https://www.ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/carameldrop)

#### Developed and Maintained by [SolemCaelum](https://github.com/SolemCaelum)
[Twitter](https://twitter.com/ponyidle) |
[Website](https://caramel.horse/) |
[Patreon](https://patreon.com/carameldrop) |
[Ko-Fi](https://ko-fi.com/carameldrop)
