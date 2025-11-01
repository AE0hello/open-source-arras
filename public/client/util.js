import { global } from "./global.js";
import { config } from "./config.js";

const util = (function() {
    return {
        submitToLocalStorage: name => {
            localStorage.setItem(name + 'Value', document.getElementById(name).value);
            localStorage.setItem(name + 'Checked', document.getElementById(name).checked);
            return false;
        },
        retrieveFromLocalStorage: name => {
            document.getElementById(name).value = localStorage.getItem(name + 'Value');
            document.getElementById(name).checked = localStorage.getItem(name + 'Checked') === 'true';
            return false;
        },
        pullJSON: fileName => {
            return new Promise((resolve, reject) => {
                const url = `${location.protocol}//${window.serverAdd}/${fileName}.json`;
                fetch(url).then(response => response.json()).then(json => {
                    resolve(json);
                }).catch(error => {
                    reject(error);
                });
            });
        },
        pullTotalPlayers: () => {
            const url = `${location.protocol}//${location.host}/getTotalPlayers`;
            fetch(url).then(response => response.json()).then(json => {
                global.serverStats.players = json;
            }).catch(error => {
                console.error(error);
            })
        },
        getServers: () => {
            return new Promise((resolve, reject) => {
                const url = `${location.protocol}//${location.host}/serversData.json`;
                fetch(url).then(response => response.json()).then(data => {
                    resolve(data);
                }).catch(error => reject("Failed to fetch! Error: " + error));
            });
        },
        getRatio: () => Math.max(global.screenWidth, 16 * global.screenHeight / 9) / global.player.renderv,
        getScreenRatio: () => Math.max(global.screenWidth, 11 * global.screenHeight / 9) / global.screenSize,
        isNumeric: (string) => /^[+-]?\d+(\.\d+)?$/.test(string), // Check if a string is a numeric string
        lerp: (a, b, x, syncWithFps = false) => {
            if (syncWithFps) {
                if (global.fps < 20) global.fps = 20;
                x /= global.fps / 120;
            }
            return a + x * (b - a);
        },
        lerpAngle: (is, to, amount, syncWithFps) => {
            var normal = {
                x: Math.cos(is),
                y: Math.sin(is)
            };
            var normal2 = {
                x: Math.cos(to),
                y: Math.sin(to)
            };
            var res = {
                x: util.lerp(normal.x, normal2.x, amount, syncWithFps),
                y: util.lerp(normal.y, normal2.y, amount, syncWithFps)
            };
            return Math.atan2(res.y, res.x);
        },
        handleLargeNumber: (a, cullZeroes = false) => {
            if (cullZeroes && a == 0) {
                return '';
            }
            if (a < Math.pow(10, 3)) {
                return '' + a.toFixed(0);
            }
            if (a < Math.pow(10, 6)) {
                return (a / Math.pow(10, 3)).toFixed(2) + "k";
            }
            if (a < Math.pow(10, 9)) {
                return (a / Math.pow(10, 6)).toFixed(2) + "m";
            }
            if (a < Math.pow(10, 12)) {
                return (a / Math.pow(10, 9)).toFixed(2) + "b";
            }
            if (a < Math.pow(10, 15)) {
                return (a / Math.pow(10, 12)).toFixed(2) + "t";
            }
            return (a / Math.pow(10, 15)).toFixed(2) + "q";
        },
        timeForHumans: x => {
            // ought to be in seconds
            let seconds = x % 60;
            x /= 60;
            x = Math.floor(x);
            let minutes = x % 60;
            x /= 60;
            x = Math.floor(x);
            let hours = x % 24;
            x /= 24;
            x = Math.floor(x);
            let days = x;
            let y = '';
    
            function weh(z, text) {
                if (z) {
                    y = y + ((y === '') ? '' : ', ') + z + ' ' + text + ((z > 1) ? 's' : '');
                }
            }
            weh(days, 'day');
            weh(hours, 'hour');
            weh(minutes, 'minute');
            weh(seconds, 'second');
            if (y === '') {
                y = 'less than a second';
            }
            return y;
        },
        addArticle: string => {
            return (/[aeiouAEIOU]/.test(string[0])) ? 'an ' + string : 'a ' + string;
        },
        formatLargeNumber: x => {
            return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        },
        formatKills: (a, b, c) => {
            if (c != 0 || b != 0) b = "/" + b, c = "/" + c; else b = "", c = "";
            return a + b + c
        },
        remove: (array, index) => {
            // there is more than one object in the container
            if (index === array.length - 1) {
                // special case if the obj is the newest in the container
                return array.pop();
            } else {
                let o = array[index];
                array[index] = array.pop();
                return o;
            }
        },
        Smoothbar: (value, speed, sharpness = 3, lerpValue = .05, syncWithfps = false) => {
            let time = Date.now();
            let display = value;
            let oldvalue = value;
            return {
                expectedValue: () => {
                    return value
                },
                set: val => {
                    if (value !== val) {
                        oldvalue = display;
                        value = val;
                        time = Date.now();
                    }
                },
                get: (round = false) => {
                    display = util.lerp(display, value, lerpValue, syncWithfps);
                    if (Math.abs(value - display) < 0.1 && round) display = value;
                    return display;
                },
                force: (val) => {
                    display = value = val;
                },
            };
        },
        AdvancedSmoothBar: (a, b, d = 3) => {
            let value = a;
            let speed = b;
            let h = d;
            let time = Date.now();
            let display;
            let S = display = a;
            let set = (a) => {
                value !== a &&
                ((S = get()), (value = a), (time = Date.now()));
            };
            let get = () => {
                let a = (Date.now() - time) / 1e3;
                return (display =
                  a >= speed ? value : S + (value - S) * Math.pow(a / speed, 1 / h));
            }
            return {
                set: (a) => set(a),
                get: () => get(),
                force: (val) => {
                    display = value = val;
                },
            }
        },
        animBar: class {
            constructor(a = !1) {
              this.O = a;
              this.h = this.time = this.value = this.D = 0;
            }
            add(a) {
              this.D = 0 < this.h ? this.value : a;
              this.value = a;
              this.time = 0;
              this.h = 1;
            }
            get(a, b = !1) {
              if (0 === config.animationSettings.value) return this.value;
              if (0 === this.h) return 0;
              if (1 === this.h) return (this.h = 2), (this.time = a), this.D;
              a -= this.time;
              var d = 1e3 / config.roomSpeed / 30;
              2 === config.animationSettings.value
                ? ((b = a / d), (b = 8 < b ? 8 : 1 < b ? b : b * b * (3 - 2 * b)))
                : (b = a < d || b ? a / d : 1);
              a = this.D;
              d = this.value;
              if (this.O) {
                var e = 2 * Math.PI;
                d = ((((d - a + Math.PI) % e) + e) % e) - Math.PI;
              } else d -= a;

              return a + d * b;
            }
        },
        sumArray: (arr) => {
            if (!arr.length) return 0
            let sum = arr.reduce((a, b) => a + b)
            return sum
        },
        averageArray: arr => {
            if (!arr.length) return 0;
            var sum = arr.reduce((a, b) => { return a + b; });
            return sum / arr.length;
        },
        isInView: (x, y, r, mid = false) => {
            let ratio = util.getRatio();
            r += config.graphical.borderChunk;
            if (mid) {
                ratio *= 2;
                return x > -global.screenWidth / ratio - r && x < global.screenWidth / ratio + r && y > -global.screenHeight / ratio - r && y < global.screenHeight / ratio + r;
            }
            return x > -r && x < global.screenWidth / ratio + r && y > -r && y < global.screenHeight / ratio + r;
        },
        getEntityImageFromMockup: (index, color) => {
            let fail = (findex) => {
                let nindex = findex ? findex : index;
                if (nindex !== "") {
                    console.warn(`Failed to get mockup ${nindex}! Requesting that mockup!`);
                    global.socket.talk("K", nindex);
                }
            }
            let firstIndex = parseInt(index.split("-")[0]),
                mainMockup = global.mockups[firstIndex];
                if (!mainMockup) fail(), mainMockup = global.missingMockup[0];
                let guns = [],
                turrets = [],
                props = [],
                name = "",
                upgradeTooltip = "",
                rerootUpgradeTree = [],
                allRoots = [],
                trueColor = mainMockup.color;
                if (trueColor == '16 0 1 0 false' && color) trueColor = color;
            
            for (let i of index.split("-")) {
                let mockup = global.mockups[parseInt(i)];
                if (!mockup) fail(parseInt(i)), mockup = global.missingMockup[0];
                guns.push(...mockup.guns);
                turrets.push(...mockup.turrets);
                props.push(...mockup.props);
                name += mockup.name.length > 0 ? "-" + mockup.name : "";
                upgradeTooltip += mockup.upgradeTooltip ? "\n" + mockup.upgradeTooltip : "";
                if (mockup.rerootUpgradeTree) allRoots.push(...mockup.rerootUpgradeTree.split("_"));
            }
            for (let root of allRoots) {
                if (!rerootUpgradeTree.includes(root))
                    rerootUpgradeTree.push(root);
            }
            turrets.sort((a, b) => a.layer - b.layer);
            return {
                time: 0,
                index: index,
                x: mainMockup.x,
                y: mainMockup.y,
                vx: 0,
                vy: 0,
                size: mainMockup.size,
                realSize: mainMockup.realSize,
                color: trueColor,
                borderless: mainMockup.borderless,
                drawFill: mainMockup.drawFill,
                upgradeColor: mainMockup.upgradeColor ? mainMockup.upgradeColor : null,
                glow: mainMockup.glow,
                isImage: true,
                render: {
                    status: {
                        getFade: () => {
                            return 1;
                        },
                        getColor: () => {
                            return '#FFFFFF';
                        },
                        getBlend: () => {
                            return 0;
                        },
                        health: {
                            get: () => {
                                return 1;
                            },
                        },
                        shield: {
                            get: () => {
                                return 1;
                            },
                        },
                    },
                },
                facing: mainMockup.facing,
                shape: mainMockup.shape,
                name: name.substring(1),
                upgradeTooltip: upgradeTooltip.substring(1),
                upgradeName: mainMockup.upgradeName,
                score: 0,
                tiggle: 0,
                layer: mainMockup.layer,
                position: mainMockup.position,
                rerootUpgradeTree,
                guns: {
                    length: guns.length,
                    getPositions: () => Array(guns.length).fill(0),
                    getConfig: () => guns.map(g => {
                        return {
                            color: g.color,
                            alpha: g.alpha,
                            strokeWidth: g.strokeWidth,
                            borderless: g.borderless, 
                            drawFill: g.drawFill,
                            drawAbove: g.drawAbove,
                            length: g.length,
                            width: g.width,
                            aspect: g.aspect,
                            angle: g.angle,
                            direction: g.direction,
                            offset: g.offset,
                        };
                    }),
                    update: () => {},
                },
                turrets: turrets.map((t) => {
                    let o = util.getEntityImageFromMockup(t.index);
                    o.color = t.color;
                    o.borderless = t.borderless;
                    o.drawFill = t.drawFill;
                    o.realSize = o.realSize / o.size * mainMockup.size * t.sizeFactor;
                    o.size = mainMockup.size * t.sizeFactor;
                    o.sizeFactor = t.sizeFactor;
                    o.angle = t.angle;
                    o.offset = t.offset;
                    o.direction = t.direction;
                    o.facing = t.direction + t.angle;
                    o.render.f = o.facing;
                    o.layer = t.layer;
                    o.mirrorMasterAngle = t.mirrorMasterAngle;
                    return o;
                }),
            };
        },
        requestEntityImage: (data, color = "16 0 1 0 false") => {
            if (!global.cached.imageEntities) global.cached.imageEntities = [];
            if (!global.cached.indexes) global.cached.indexes = [];
            if (!data) throw new Error("undefined detected!");
            if (typeof data === 'string' || data instanceof String && data.includes("-")) return util.getEntityImageFromMockup(data, color);
            let image = {};
            for (let index of typeof data === 'string' || data instanceof String ? data.split("-") : data.index.split("-")) {
                if (global.cached.indexes.includes(index)) {
                    const int = typeof data === 'string' || data instanceof String ? data.toString() : index;
                    image = global.cached.imageEntities.find(o => o.index == int);
                    continue;
                };
                image = util.getEntityImageFromMockup(typeof data === 'string' || data instanceof String ? data.toString() : data.index, color);
                global.cached.imageEntities.push(image);
                global.cached.indexes.push(index);
            }
            if (data.isProp) {
                return {
                    index: image.index,
                    color: image.color,
                    borderless: data.borderless,
                    drawFill: data.drawFill,
                    layer: data.layer,
                    realSize: data.realSize / data.size * image.size * data.sizeFactor,
                    size: image.size * data.sizeFactor,
                    sizeFactor: data.sizeFactor,
                    angle: data.angle,
                    offset: data.offset,
                    direction: data.direction,
                    facing: data.direction + data.angle,
                    render: image.render,
                    shape: image.shape,
                    guns: image.guns,
                    turrets: image.turrets,
                    mirrorMasterAngle: true,
                    isImage: true,
                }
            } else return image;
        }
    }
})();

export { util };