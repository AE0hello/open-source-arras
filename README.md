# Open Source Arras

<img alt="Logo" src="public/imgs/round.png" width="100"/>

![GitHub Release](https://img.shields.io/github/v/release/AE0Hello/open-source-arras)
![Discord](https://img.shields.io/discord/1004907608018264094)
![GitHub repo size](https://img.shields.io/github/repo-size/AE0Hello/open-source-arras)
# WARNING
This version has a bit of shit codes and will be fixed in the next beta. Or fix it by yourself.
#
**Open Source Arras is beta software.** This build is of a work-in-progress rewrite and is **not** representative of the final product. Expect lots of bugs and missing features! (also the links still go to the old repo)

Major updates may introduce breaking changes that alter how certain things work. It is **your responsibility** to keep your private server up-to-date and functioning!

## Setup Guide (Localhost)

This guide covers setting up your server on your own hardware and only supports PCs running up-to-date versions of Windows/macOS/Linux.

You'll first need to install [Node.js](https://nodejs.org). It doesn't matter if you pick the LTS or Latest version, they'll both work fine.

Once `Node.js` is installed, [download the source code of the latest release of Open Source Arras](https://github.com/Taureon/aps-plus-plus/releases). Extract it once it's downloaded and open either `run.bat` (if you're on Windows) or `run.sh` (if you're not). If there aren't any errors, your server will start up. Go to `localhost:3000` in your favourite web browser (keep the terminal window open, closing it will shut down the server) to play.

[If you need a more detailed guide, click here for a step by step list.](https://github.com/Taureon/aps-plus-plus/wiki/Frequently-Asked-Questions#how-do-i-set-up-my-server)

If you want to stay up to date, fork this template, download a git client, and sync the fork whenever there's a major update.

## Setup Guide (Webhost)

Don't have a supported device or don't want to mess around with localhost? Get a webhost to do the dirty work for you.

Create a new project and choose to import one from GitHub. When prompted for the URL of the repository, type in `https://github.com/Taureon/aps-plus-plus.git`.

Navigate to `server/config.js` and replace `localhost:3000` with the URL for your project.

After doing that, your server should be ready!

## Change servers (IMPORTANT)
Before you attempt to connect to the server, to server.js and scroll until you see something like this ("loadGameServer()") There you can change the host, gamemode, region, and the properties. I know that its a bit weird that you have to change inside server.js instead of Config.js, but it will be improved in the next beta release.

## Useful Tools
- [Create a custom shape](https://arras.io/ext/custom-shape)
- [Official Addon list](https://github.com/Taureon/aps-plus-plus-addons)
- [Unofficial Server list](https://zyrafaq.com/arras-server-list/)

## Other Links
- [Our Discord server](https://discord.gg/kvCAZfUCjy)

*p.s. if something goes terribly wrong it's not our fault*
