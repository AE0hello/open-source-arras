# Arras Community Edition

<img alt="Logo" src="public/img/round.png" width="100"/>

> WARNING: Arras Community Edition is beta software. This build is not representative of the final product. Expect bugs and missing features.

## Fork Notice
This project is a fork of https://github.com/AE0hello/open-source-arras/.

## What Is This
Arras Community Edition is a self-hostable multiplayer game server with a web client. It provides:
- A web server for the client (default `http://localhost:3000`)
- One or more game servers (default ports `3001+`)
- A modding surface (definitions, addons, room setups)
- Optional player accounts and stats

## Requirements
- Node.js 18+ (see `package.json`)
- npm

## Quick Start (Localhost)
1. Install dependencies:
   - `npm install`
2. Run the server:
   - Windows: `run.bat`
   - macOS/Linux: `./run.sh`
   - Alternative: `npm start`
3. Open the client:
   - `http://localhost:3000`

If you see an error about `ws`, run `npm install ws`.

## Docker (Local Dev)
Build the image:
- `docker build -t arras-ce .`

Run with a bind mount so local edits apply immediately:
```sh
docker run -d --name arras \
  -p 3000-3017:3000-3017 \
  -v "$(pwd):/usr/src/app" \
  arras-ce
```

Stop/remove the container:
- `docker stop arras`
- `docker rm arras`

Note: If you run without the bind mount, rebuild the image after code changes.

## Project Layout
Key locations for common tasks:
- `server/server.js`: main entry for the web server and worker game servers
- `server/config.js`: core configuration (ports, servers, gameplay)
- `server/.env`: API keys and tokens
- `server/data/users.json`: account storage
- `server/data/sessions.json`: session storage
- `server/Game/`: game logic
- `server/lib/definitions/`: entity definitions and addons
- `server/Game/addons/`: gameplay addons (chat commands, server travel)
- `server/Game/room_setup/`: room/tiles/maps
- `public/`: web client assets

## Running In Production
Minimal approach:
- Run `npm start` (or your preferred process manager)
- Reverse proxy `localhost:3000` if hosting externally
- Ensure your `Config.host` and server `host` values match your public address

Recommended:
- Use a process manager (pm2, systemd)
- Keep `server/data/` backed up
- Rotate API keys if exposed

Quick hosting config (set in `server/.env`):
- `PUBLIC_HOST`: public domain or IP (no port)
- `PORT`: web server port (client HTTP)
- `GAME_HOST`: public domain or IP for game servers (defaults to `PUBLIC_HOST`)
- `GAME_PORT_BASE`: starting port for game servers (defaults to 3001)

## Configuration Guide
All main settings live in `server/config.js`. Common sections:

### Web Server
- `host`: public host or `localhost:3000`
- `port`: web server port (client connects here)
- `allow_ACAO`: allow cross-origin requests

### Game Servers
`Config.servers` defines each game server. Example:
```js
servers: [
  {
    share_client_server: false,
    host: "localhost:3001",
    port: 3001,
    id: "ffa",
    featured: false,
    region: "local",
    gamemode: ["ffa"],
    player_cap: 80,
    properties: { bot_cap: 16 }
  }
]
```

Notes:
- `host` can be `localhost:PORT` or a domain.
- `gamemode` is a list of mode config files from `server/Game/gamemodeconfigs/`.
- `properties` overrides any `Config` values for that server.
- `player_cap` is displayed to the client and used for capacity checks.

### API and Tokens
`server/.env` contains keys used by server travel and permissions:
- `API_KEY`: used for `/api/sendPlayer` when transferring players.
- Tokens for permissions (developer, beta tester, etc.)

### Game Tuning
You can tweak gameplay using settings like:
- `bot_cap`, `bot_name_prefix`, `bot_ai_settings`
- `game_speed`, `run_speed`
- `room_bound_force`, `map_tile_width`, `map_tile_height`
- `spawn_message`, chat settings, seasonal toggles

## Accounts and Sessions
Account routes are exposed by the web server:
- `POST /api/register`
- `POST /api/login`
- `POST /api/logout`
- `POST /api/validate`
- `POST /api/profile`
- `POST /api/friends` and friends subroutes

Data is stored in:
- `server/data/users.json`
- `server/data/sessions.json`

If you delete these files, accounts and sessions reset.

## Server Travel (Nexus)
To enable portals between servers:
1. In each destination server, set `ALLOW_SERVER_TRAVEL: true` in `properties`.
2. Add travel settings to a source server:
```js
SERVER_TRAVEL_PROPERTIES: {
  LOOP_INTERVAL: 10000,
  AMOUNT: 1
},
SERVER_TRAVEL: [
  {
    IP: "localhost:3002",
    PORTAL_PROPERTIES: {
      SPAWN_CHANCE: 3,
      COLOR: "red"
    }
  }
]
```

## Addons (Gameplay)
Game addons live in `server/Game/addons/`. They can:
- Register chat commands
- Hook into global events
- Modify behavior at runtime

Most addons rely on globals (like `Events`), and may export a function:
```js
module.exports = ({ Events, Config }) => {
  Events.on("chatMessage", () => {});
};
```

## Addons (Entities)
Entity addons live in `server/lib/definitions/entityAddons/`.
They load after definitions and can modify `Class`:
```js
module.exports = ({ Class }) => {
  Class.myTank = { /* ... */ };
};
```

## Definitions (Tanks, Projectiles, Walls)
Definition groups are in `server/lib/definitions/groups/`.
Entry points include:
- `generics.js`
- `misc.js` (walls, rocks, bots)
- `tanks.js`
- `projectiles.js`

Add new definitions to a group or add a new group file and reference it from `server/lib/definitions/combined.js` if needed.

## Rooms and Maps
Room setups are in `server/Game/room_setup/`.
- Tiles: `server/Game/room_setup/tiles/`
- Room definitions: `server/Game/room_setup/rooms/`
- Mode configs set `room_setup`

To add a new room:
1. Create a room file in `rooms/`
2. Use tiles from `tiles/` (or define new tiles)
3. Add the room setup to a gamemode config

## Bots and AI
Bot behavior is driven by controllers in `server/miscFiles/controllers.js`.
You can:
- Change the default bot controllers in `server/lib/definitions/groups/misc.js` (`Class.bot`)
- Add new IO controllers and attach them to bots
- Customize bot stats in `server/config.js`

## Admin and Moderation
Permissions live in `server/permissions.js` and are tied to tokens in `server/.env`.
Chat commands are in `server/Game/addons/chatCommands.js` and can be extended.

## Troubleshooting
Common issues:
- `Package 'ws' is not installed` -> run `npm install`
- Port already in use -> change `Config.port` and server ports
- Client connects but no game servers -> check `Config.servers` array
- Server travel not working -> verify `API_KEY` and `ALLOW_SERVER_TRAVEL`

## Contributing
1. Fork the repository.
2. Create a feature branch.
3. Keep changes focused and explain why.
4. Open a PR with repro steps or screenshots for gameplay/UI changes.

## License
See `LICENSE` for the full text (Unlicense).

## Credits
See `credits.md`.

## Community
- Discord: https://discord.gg/arras
