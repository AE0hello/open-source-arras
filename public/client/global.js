import { util } from "./util.js";

const missingno = {
    index: -1,
    name: "missingno",
    x: 0,
    y: 0,
    color: "mirror 0 1 0 true",
    strokeWidth: 1,
    upgradeColor: null,
    glow: {
        radius: null,
        color: null,
        alpha: 1,
        recursion: 1
    },
    borderless: false,
    drawFill: true,
    shape: "image=/missingno.png",
    imageInterpolation: "bilinear",
    size: 12,
    realSize: 12,
    facing: 0,
    position: {
        axis: 2.0000006188980963,
        middle: {
            x: 3.094490002740532e-7,
            y: -3.0944900009099996e-7
        }
    },
    statnames: { body_damage: "???", max_health: "???", max_health: "???", bullet_speed: "???", bullet_health: "???", bullet_pen: "???", bullet_damage: "???", reload: "???", move_speed: "???", shield_regen: "???", shield_cap: "???" },
    rerootUpgradeTree: "basic", // todo: find a way to make this automatically change to Config.spawn_class without bricking everything
    className: "missingno",
    upgrades: [],
    guns: [],
    turrets: [],
    props: []
};
function Clickable() {
    let region = {
        x: 0,
        y: 0,
        w: 0,
        h: 0,
    };
    let active = false;
    return {
        set: (x, y, w, h) => {
            region.x = x * global.ratio;
            region.y = y * global.ratio;
            region.w = w * global.ratio;
            region.h = h * global.ratio;
            active = true;
        },
        check: target => {
            let dx = Math.round(target.x - region.x);
            let dy = Math.round(target.y - region.y);
            return active && dx >= 0 && dy >= 0 && dx <= region.w && dy <= region.h;
        },
        hide: () => {
            active = false;
        },
    };
}
let Region = (size) => {
    // Define the region
    let data = [];
    for (let i = 0; i < size; i++) {
        data.push(Clickable());
    }
    // Return the region methods
    return {
        place: (index, ...a) => {
            if (index >= data.length) {
                console.log(index);
                console.log(data);
                throw new Error('Trying to reference a clickable outside a region!');
            }
            data[index].set(...a);
        },
        hide: () => {
            for (let region of data) region.hide();
        },
        check: x => data.findIndex(r => r.check(x))
    };
};

let gameDraw;

const global = {
    // Keys and other mathematical constants. You can find the list here: https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/keyCode
    // Special key for cheats / commands
    KEY_SPECIAL: 192, // `

    KEY_ESC: 27,// Escape
    KEY_ENTER: 13,// Enter
    KEY_SHIFT: 16,// Shift
    KEY_BECOME: 70,// F
    KEY_CHAT: 13,// Enter
    KEY_FIREFOOD: 119,// F8
    KEY_SPLIT: 32,// Space

    KEY_LEFT: 65,// A
    KEY_UP: 87,// W
    KEY_RIGHT: 68,// D
    KEY_DOWN: 83,// S
    KEY_LEFT_ARROW: 37,// ArrowLeft
    KEY_UP_ARROW: 38,// ArrowUp
    KEY_RIGHT_ARROW: 39,// ArrowRight
    KEY_DOWN_ARROW: 40,// ArrowDown

    KEY_AUTO_SPIN: 67,// C
    KEY_AUTO_FIRE: 69,// E
    KEY_AUTO_ALT: 71,// G
    KEY_OVER_RIDE: 82,// R
    KEY_REVERSE_TANK: 86,// V
    KEY_REVERSE_MOUSE: 66,// B
    KEY_SPIN_LOCK: 88,// X

    KEY_LEVEL_UP: 78,
    KEY_TOKEN: 80,// P
    KEY_CLASS_TREE: 84,// T
    KEY_MAX_STAT: 77,// M
    KEY_SUICIDE: 79,// O
    KEY_ZOOM_OUT: 45,// ??
    KEY_ZOOM_IN: 61,// ??
    KEY_DEBUG: 76,// L

    KEY_SCREENSHOT: 81,//Q
    KEY_RECORD: 90,//Z

    KEY_UPGRADE_ATK: 49,// 1
    KEY_UPGRADE_HTL: 50,// 2
    KEY_UPGRADE_SPD: 51,// 3
    KEY_UPGRADE_STR: 52,// 4
    KEY_UPGRADE_PEN: 53,// 5
    KEY_UPGRADE_DAM: 54,// 6
    KEY_UPGRADE_RLD: 55,// 7
    KEY_UPGRADE_MOB: 56,// 8
    KEY_UPGRADE_RGN: 57,// 9
    KEY_UPGRADE_SHI: 48,// 0
    KEY_MOUSE_0: 32,// 32
    KEY_MOUSE_1: 86,// V
    KEY_MOUSE_2: 16,// ShiftLeft
    KEY_CHOOSE_1: 89,// Y
    KEY_CHOOSE_2: 85,// U
    KEY_CHOOSE_3: 73,// I
    KEY_CHOOSE_4: 72,// H
    KEY_CHOOSE_5: 74,// J
    KEY_CHOOSE_6: 75,// K

    showTree: false,
    scrollX: 0,
    realScrollX: 0,
    // Canvas
    screenWidth: window.innerWidth,
    screenHeight: window.innerHeight,
    gameWidth: 0,
    gameHeight: 0,
    xoffset: -0,
    yoffset: -0,
    gameLoading: false,
    gameStart: false,
    gameConnecting: false,
    gameUpdate: false,
    disconnected: false,
    autoSpin: false,
    syncingWithTank: false,
    respawnTimeout: false,
    showDebug: false,
    died: false,
    kicked: false,
    continuity: false,
    glCanvas: null,
    showChat: 0,
    generateTankTree: false,
    specialPressed: false,
    specialKeysPressed: [],
    backgroundColor: '#f2fbff',
    lineColor: '#000000',
    nameColor: "#FFFFFF",
    message: "",
    player: {},
    messages: [],
    mockups: [],
    missingno: [missingno],
    roomSetup: [],
    entities: [],
    cached: {},
    updateTimes: 0,
    pullUpgradeMenu: false,
    pullSkillBar: false,
    clickables: {
        stat: Region(10),
        upgrade: Region(100),
        clicked: false,
        hover: Region(1),
        skipUpgrades: Region(1),
        mobileButtons: Region(20),
        exitGame: Region(1),
        deathRespawn: Region(1),
        reconnect: Region(1),
        classTreeZoomOut: Region(2),
        classTreeZoomIn: Region(2),
        classTreeClose: Region(1),
        // Daily tanks buttons
        dailyTankUpgrade: Clickable(),
        dailyTankAd: Clickable(),
        dailyTankCloseAd: Clickable(),
        optionsMenu: {
            switchButton: Region(2),
            toggleBoxes: Region(100),
            HoverBoxes: Region(100),
        }
    },
    optionsMenu_Anim: {isOpened: false}, // Placeholder
    dailyTankAd: {
        render: undefined,
        closeable: false,
        renderUI: false,
        readyToRender: false,
        isVideo: false,
        width: 1204,
        height: 670,
        exit: () => {
            try {
                global.dailyTankAd.render.pause();
            } catch { };
            global.dailyTankAd.renderUI = false;
            global.dailyTankAd.readyToRender = false;
            global.dailyTankAd.closeable = false;
            global.dailyTankAd.videoBar = undefined;
            global.dailyTankAd.closebtnAnim = undefined;
            global.dailyTankAd.width = global.dailyTankAd.orginWidth;
            global.dailyTankAd.height = global.dailyTankAd.orginHeight;
            global.dailyTankAd.render = undefined;
        }
    },
    statHover: false,
    upgradeHover: false,
    statMaxing: false,
    metrics: {
        latency: [],
        lag: 0,
        rendertime: 0,
        rendertimes: 1,
        rendertime_color: "not found",
        updatetime: 0,
        lastlag: 0,
        lastrender: 0,
        rendergap: 0,
        lastuplink: 0,
        mspt: 0,
    },
    advanced: {
        roundMap: false,
        blackout: {
            active: false,
            color: "#000000"
        },
    },
    bandwidth: {
        currentHa: 0,
        currentFa: 0,
        finalHa: 0,
        finalFa: 0,
    },
    mobileStatus: {
        enableCrosshair: false,
        showCrosshair: false,
        useBigJoysticks: false,
        showJoysticks: false,
    },
    GUIStatus: {
        renderGUI: false,
        renderLeaderboard: false,
        renderhealth: false,
        renderPlayerNames: false,
        renderPlayerScores: false,
        renderPlayerKillbar: false,
        minimapReducedInfo: false,
        fullHDMode: false,
    },
    serverStats: {
        players: "?",
        mspt: "?",
        mspt_color: "not found",
        lag_color: "not found",
        serverGamemodeName: "Unknown",
    },
    renderingInfo: {
        entities: 0,
        turretEntities: 0,
        entitiesWithName: 0,
    },
    lerp: (v, z, x) => {
        v = (x - v) / (z - v);
        return 0 >= v ? 0 : 1 <= v ? 1 : v * v * (3 - 2 * v);
    },
    refreshMonitorColoring: (e) => {
        gameDraw = e;
        global.serverStats.mspt_color = gameDraw.color.white;
        global.serverStats.lag_color = gameDraw.color.white;
        global.metrics.rendertime_color = gameDraw.color.white;
    },
    mouse: { x: 0, y: 0 },
    target: { x: 0, y: 0 },
    reverseTank: 1,
    fps: 60,
    serverStart: 0,
    screenSize: Math.min(1920, Math.max(window.innerWidth, 1280)),
    vscreenSize: 1920,
    vscreenSizey: 1080,
    ratio: window.devicePixelRatio,
    mockupLoading: { then: cb => cb() },
    treeScale: 1,
    chats: {},
    initPlayer: () => {
        let list = {
            // Set up the player
            id: -1,
            x: global.screenWidth / 2,
            y: global.screenHeight / 2,
            vx: 0,
            vy: 0,
            lastvx: 0,
            lastvy: 0,
            cx: {
                x: 0,
                animX: 0,
            },
            cy: {
                y: 0,
                animY: 0,
            },
            renderx: 0,
            rendery: 0,
            lastx: global.player.x,
            lasty: global.player.y,
            isScoping: false,
            screenx: 0,
            screeny: 0,
            renderv: 2000,
            animv: new util.animBar(),
            slip: 0,
            view: 1,
            target: global.canvas.target,
            animX: new util.animBar(),
            animY: new util.animBar(),
            roomAnim: {
                x: new util.animBar(),
                y: new util.animBar(),
            },
            name: "",
            lastUpdate: 0,
            time: 0,
            screenWidth: global.screenWidth,
            screenHeight: global.screenHeight,
            nameColor: "#ffffff",
        }
        list.animv.add(list.renderv);
        return list;
    },
    tankTree: (type) => {
        if (type === "open") {
            if (global.died) return;
            global.showTree = true;
            global.pullUpgradeMenu = true;
            global.pullSkillBar = true;
            global.socket.talk('T');
        } else if (type === "exit") {
            global.showTree = false;
            global.renderTankTree = false;
            global.pullUpgradeMenu = false;
            global.pullSkillBar = false;
            global.targetTreeScale = global.treeScale = 1;
            global.scrollX = global.scrollY = global.fixedScrollX = global.fixedScrollY = -1;
            global.scrollVelocityY = global.scrollVelocityX = 0;
            global.classTreeDrag.isDragging = false;
            global.classTreeDrag.momentum = { x: 0, y: 0 };
            global.searchQuery = '';
            global.searchBarActive = false;
            global.canvas.tankTreeProps.enabled = false;
        }
    },
    exit: () => { // When exiting and going back to the menu, reset things.
        document.getElementById("gameAreaWrapper").style.display = "none";
        global.socket && global.socket.close();
        document.getElementById("startMenuWrapper").style.display = "block";
        global.player = global.initPlayer();
        global.gameLoading = false;
        global.gameStart = false;
        global.gameUpdate = false;
        global.died = false;
        global.disconnected = false;
        global.entities = [];
        global.roomSetup = [];
        global.messages = [];
        global.metrics.latency = [];
        global.chats = {};
        global.metrics.rendertime = 0;
        global.metrics.rendertimes = 1;
        global.time = 0;
        global.metrics.lag = 0;
        global.secondaryLoop = false;
        global.gameWidth = 0;
        global.gameHeight = 0;
        global.canvas.mouseMoved = false;
        global.mockups = [];
        global.mobile && document.exitFullscreen();
        clearInterval(global.socketMotionCycle);
        global.resetTarget();
        global.clearUpgrades();
        global.resetSocket();
        setTimeout(() => {
            document.getElementById("startMenuWrapper").style.top = "0px";
        }, 10);
    },
    reconnect: () => {
        global.player = global.initPlayer();
        global.gameLoading = false;
        global.gameStart = false;
        global.gameUpdate = false;
        global.died = false;
        global.disconnected = false;
        global.gameConnecting = true;
        global.message = "";
        global.entities = [];
        global.roomSetup = [];
        global.messages = [];
        global.metrics.latency = [];
        global.chats = {};
        global.metrics.rendertime = 0;
        global.metrics.rendertimes = 1;
        global.time = 0;
        global.metrics.lag = 0;
        global.secondaryLoop = false;
        global.mockups = [];
        global.canvas.mouseMoved = false;
        clearInterval(global.socketMotionCycle);
        global.resetTarget();
        global.clearUpgrades(true);
        global.resetSocket();
        global.startGame();
    }
};
export { global };
