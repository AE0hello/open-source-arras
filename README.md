# Open Source Arras

<img alt="Logo" src="public/imgs/round.png" width="100"/>

![GitHub Release](https://img.shields.io/github/v/release/AE0Hello/open-source-arras)
![Discord](https://img.shields.io/discord/1004907608018264094)
![GitHub repo size](https://img.shields.io/github/repo-size/AE0Hello/open-source-arras)

## WARNING
This is an unstable build. Use at your own risk and expect many upcoming bugs.
#
**Open Source Arras is beta software.** This build is of a work-in-progress rewrite and is **not** representative of the final product. Expect lots of bugs and missing features! (also the links still go to the old repo)

Major updates may introduce breaking changes that alter how certain things work. It is **your responsibility** to keep your private server up-to-date and functioning!

## Setup Guide (Localhost)

This guide covers setting up your server on your own hardware and only supports PCs running up-to-date versions of Windows/macOS/Linux.

You'll first need to install [Node.js](https://nodejs.org). It doesn't matter if you pick the LTS or Latest version, they'll both work fine.

Once `Node.js` is installed, [download the source code of the latest release of Open Source Arras](https://github.com/AE0hello/open-source-arras/releases). Extract it once it's downloaded and open either `run.bat` (if you're on Windows) or `run.sh` (if you're not). If there aren't any errors, your server will start up. Go to `localhost:3000` in your favourite web browser (keep the terminal window open, closing it will shut down the server) to play.

[If you need a more detailed guide, click here for a step by step list.](https://github.com/Taureon/aps-plus-plus/wiki/Frequently-Asked-Questions#how-do-i-set-up-my-server)

If you want to stay up to date, fork this template, download a git client, and sync the fork whenever there's a major update.

## Setup Guide (Webhost)

Don't have a supported device or don't want to mess around with localhost? Get a webhost to do the dirty work for you.

Create a new project and choose to import one from GitHub. When prompted for the URL of the repository, type in `https://github.com/AE0hello/open-source-arras.git`.

Navigate to `server/config.js` and replace `localhost:3000` with the URL for your project.

After doing that, your server should be ready!

## Server setup

You can set up in-game servers in config.js file, in `SERVERS`. For further explanation, see the setting itself. It's an array of objects was each object is a server.

## Setup server travel

If you ever want to travel between servers? here's how you can set it up in just 3 minutes.

First copy this code to the server's `PROPERTIES`:
```
SERVER_TRAVEL_PROPERTIES: {
    LOOP_INTERVAL: 10000,
    AMOUNT: 1,
},
SERVER_TRAVEL: [
    {
        IP: "<YourIP>", // don't add "https://" or this "/".
        PORTAL_PROPERTIES: {
            SPAWN_CHANCE: 3,
            COLOR: 12
        }
    }
]
```
Paste as `IP` you destination server IP address.

`SPAWN_CHANCE` is a chance for a portal to spawn somewhere in the map each loop iteration. The higher, the more chances.

`COLOR` color of the portal.

`LOOP_INTERVAL` is how often will the portal loop execute.

`AMOUNT` is the amount of portals to spawn.


After you set this up, you can now launch the game and see if a portal spawns.

Before you launch the server, You need to set `ALLOW_SERVER_TRAVEL` to true in your destination server's `PROPERTIES`.

If you find any problems, contact support by joining our discord server.

Now everything should work, if you find any problems, contact support by joining our discord server.

## Useful Tools
- [Create a custom shape](https://arras.io/ext/custom-shape)
- [Official Addon list](https://github.com/Taureon/aps-plus-plus-addons)
- [Unofficial Server list](https://zyrafaq.com/arras-server-list/)

## Other Links
- [Our Discord server](https://discord.gg/kvCAZfUCjy)

*p.s. if something goes terribly wrong, it's not our fault*
