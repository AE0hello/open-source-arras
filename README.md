# Open Source Arras (Ciper Probe Version)

- I made some stuff here.

- This repository is forked. The original repository is this [link](https://github.com/AE0hello/open-source-arras).

---

# Credits

- Modified by `Ciper Probe`
- Original forked repository by [`AE0hello`](github.com/AE0hello)

# Old/Other Credits

`funny0_0` = Maze generation codes, Manhunt, Shiny tanks, SVG paths, Kill bar system\
`LA3T` = Custom wall collisions\
`PR2000` = `worker_threads`\
`Excel` = Clan Wars, Manhunt\
`DenisC!!!` = Accurate growth curve

---

# Instructions

- Prerequisites: Node.js version 18.0.0 or higher (download from [nodejs.org](https://nodejs.org/))

- Installation: Clone or download this repository to your local machine. Navigate to the project directory in your terminal. Run `npm install` to install all required dependencies.

- Configuration: Edit the `server/.env` file and set a unique `API_KEY`.

- Running the Server: Execute `npm start` to launch the game server. The server will start on port 3000.

- Accessing the Game: Open a web browser and navigate to `http://localhost:3000` to join the multiplayer tank game.

---

# Changes

- Added "2TDM One Dominator" gamemode with a single dominator at center that switches teams when captured, cycles through random variants (destroyer/gunner/trapper), there is no win condition.

- Added "AI Chaos 2TDM" gamemode with 80 bots for chaotic team deathmatch gameplay.

- Added "AI Chaos FFA" gamemode with 80 bots for chaotic free-for-all gameplay.

- Added "Nostalgia": Iykyk. ;)

- Added "Boss Battle": OPEN TDM with 1 team, 32 bots, and a large Kronos boss. Win condition: defeat the boss.

- Added "Survive the Arena Closer": OPEN TDM with 1 team, bots enabled, and an Arena Closer in the center. No win condition

- Updated server IDs: 2TDM server ID changed to "2tdm", FFA server ID changed to "ffa".

- Fixed FOV zoom functionality for backtick + - and backtick + = commands by updating key code mappings to support multiple keyboard layouts (For "-" it has: 45, 189, 109, 173; for "=" it has: 61, 187, 107, 171).

- Modified the game watermark ("Arras Ciper Probe Version") to display in white text with black outline instead of the previous green-blue gradient from the original "Open Source Arras".

- Removed the "Build: 2.0.10" display from the game UI. (Since its useless)

- Commented out (incase if someone wants them enabled) the "menu_testing" entry in the developer's UPGRADES_TIER_0 array in server/lib/definitions/groups/dev.js to disable access to the testing menu.

- Added the "Ciper Probe's Stuff" menu as an upgrade from the Developer tank

- Implemented bot auto-balance system for TDM mode that ensures equal bot distribution across teams

- Fixed upgrade points at level 45 to be 42 instead of 44

- Commented out guillotine and banHammer classes (because they do not work.)

- server selector categories now only show "local" instead of multiple region and game mode filters.

- Disabled ads requirement for daily tanks (set ads.enabled to false in config.js) so players can access them without watching advertisements.

- Commented out retired developer tanks (Diamond Marauder and Lavender) to prevent mockup loading errors

- Commented out Tank Changes Menu from the beta tester upgrade list.

- Added custom networking system with binary protocol, packet validation, compression, and performance monitoring. Includes custom packet types (MOVEMENT, ACTION, MESSAGE, etc.), seamless integration with existing socket manager, enhanced security features, and real-time network statistics. Fully backward compatible with legacy packets while providing significant performance improvements.

# Improvements

- Configured ESLint with custom rules and globals, reducing code quality issues from 3248 to 272.

- Added JSDoc documentation to key functions like loadGameServer for better code maintainability.

- Fixed various code quality issues including unused variables and empty blocks. (I guess.)

# Original Issues/Pull Request Changes

## These Fixes are Unofficially tested and are just thrown there for the sake of it. Expect some to not work!

- Fixed guns being treated as arrays instead of Maps in AI controllers by updating loops to use Map.values().

- Corrected gun delay calculation bug by fixing maxCycleTimer formula.

- Removed unnecessary damage multiplication and fixed master reassignment in destroy method.

- Made eggs tangible by setting INTANGIBLE to false in Class.egg definition to prevent immortal stacking.

- Fixed typo in Class.serverPortal: changed ITS_OWN_TYPE to HITS_OWN_TYPE.

- Renamed "Shogun" to "Shogunate" in hexDreadNames.

- Resolved syntax error in io_healTeamMasters controller by fixing malformed if statement.