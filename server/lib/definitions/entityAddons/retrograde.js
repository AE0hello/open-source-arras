const { combineStats, makeGuard, makeMenu, makeRearGunner, weaponArray, weaponMirror } = require('../facilitators.js')
const { base } = require('../constants.js')
const g = require('../gunvals.js')

// Settings
const add_to_main_class_tree = true // Set to true to enable Retrograde mode
const public_retrograde_menu = false // Set to true to allow access to the Retrograde menu and everything inside it for all players
const replace_newer_classes = false // Set to true to make the class tree replace certain entries with Retrograde equivalents

// Menus
Class.arrasMenu_diep2.UPGRADES_TIER_0.push(
    "blaster_RG",
    "gatlingGun_RG",
    "machineFlank_RG",
    "rifle_RG",
    "buttbuttin_RG",
    "blower_RG",
    "quadTwin_RG",
    "tornado_RG",
    //"subverter_RG",
    //"battery_RG",
    //"deathStar_RG",
    //"bonker_RG",
    "protector_RG",
    //"doubleTrapGuard_RG",
)

Class.arrasMenu_retrograde = makeMenu("Retrograde") // feature-reduced menu for retrograde event
Class.arrasMenu_retrograde.UPGRADES_TIER_0 = [
    "arrasMenu_diep",
    "arrasMenu_digdig",
    "menu_celestials", // placeholder until we get the arras'd version of this menu (celestial bosses, all rigged to self-destruct in 10 seconds)
    "menu_elites", // placeholder until we get the arras'd version of this menu (elite bosses)
    "menu_mysticals", // placeholder until we get the arras'd version of this menu (strange bosses)
    "arrasMenu_nostalgia",
    "arrasMenu_scrapped",
    "arrasMenu_miscRetrograde",
]

Class.arrasMenu_miscRetrograde = makeMenu("Misc Retrograde") // former menu, for retrograde event
Class.arrasMenu_miscRetrograde.UPGRADES_TIER_0 = [
    "tracker3",
    "tetraGunner",
    "worstTank",
]

// Tier 2
Class.blaster_RG = {
    PARENT: "genericTank",
    LABEL: "Blaster",
    DANGER: 6,
    GUNS: [
        {
            POSITION: {
                LENGTH: 7.5,
                WIDTH: 12,
                ASPECT: 1.2,
                X: 8
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, { size: 0.92 }, g.blaster]),
                TYPE: "bullet"
            }
        }
    ]
}
Class.gatlingGun_RG = {
    PARENT: "genericTank",
    LABEL: "Gatling Gun",
    DANGER: 6,
    GUNS: [
        {
            POSITION: {
                LENGTH: 24,
                WIDTH: 10,
                ASPECT: 1.4
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.focal]),
                TYPE: "bullet"
            }
        }
    ]
}
Class.machineFlank_RG = {
    PARENT: "genericTank",
    LABEL: "Machine Flank",
    GUNS: weaponArray({
        POSITION: {
            LENGTH: 12,
            WIDTH: 10,
            ASPECT: 1.4,
            X: 8
        },
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, { size: 0.92 }]),
            TYPE: "bullet"
        }
    }, 2)
}
Class.rifle_RG = {
    PARENT: "genericTank",
    LABEL: "Rifle",
    DANGER: 6,
    BODY: {
        FOV: base.FOV * 1.225
    },
    GUNS: [
        {
            POSITION: {
                LENGTH: 22,
                WIDTH: 7
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.rifle]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: {
                LENGTH: 14,
                WIDTH: 10.5
            }
        }
    ]
}

// Tier 3
Class.accurator_RG = {
    PARENT: "genericTank",
    LABEL: "Accurator",
    DANGER: 7,
    GUNS: [
        {
            POSITION: {
                LENGTH: 3,
                WIDTH: 0.1,
                ASPECT: -10,
                X: 24
            }
        },
        {
            POSITION: {
                LENGTH: 24,
                WIDTH: 10,
                ASPECT: 1.4
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.focal]),
                TYPE: "speedBullet"
            }
        }
    ]
}
Class.blower_RG = makeRearGunner("destroyer", "Blower")
Class.buttbuttin_RG = makeRearGunner("assassin", "Buttbuttin")
Class.halfNHalf_RG = {
    PARENT: "genericTank",
    LABEL: "Half 'n Half",
    DANGER: 7,
    GUNS: [
        {
            POSITION: {
                LENGTH: 24,
                WIDTH: 10,
                ASPECT: 1.4
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.focal]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: {
                LENGTH: 12,
                WIDTH: 10,
                ASPECT: 1.4,
                X: 8,
                ANGLE: 180
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, { size: 0.92 }]),
                TYPE: "bullet"
            }
        }
    ]
}
Class.machineTriple_RG = {
    PARENT: "genericTank",
    LABEL: "Machine Triple",
    DANGER: 7,
    GUNS: weaponArray({
        POSITION: {
            LENGTH: 12,
            WIDTH: 10,
            ASPECT: 1.4,
            X: 8
        },
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, { size: 0.92 }]),
            TYPE: "bullet"
        }
    }, 3)
}
Class.quadTwin_RG = {
    PARENT: "genericTank",
    LABEL: "Quad Twin",
    DANGER: 7,
    GUNS: weaponArray(weaponMirror({
        POSITION: {
            LENGTH: 20,
            WIDTH: 8,
            Y: 5.5
        },
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.spam, g.doubleTwin, g.tripleTwin]),
            TYPE: "bullet"
        }
    }), 4)
}
Class.rifleGuard_RG = makeGuard("rifle_RG")
Class.sniperRifle_RG = {
    PARENT: "genericTank",
    LABEL: "Sniper Rifle",
    DANGER: 7,
    BODY: {
        FOV: base.FOV * 1.35
    },
    GUNS: [
        {
            POSITION: {
                LENGTH: 30,
                WIDTH: 7
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.assassin, g.rifle]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: {
                LENGTH: 14,
                WIDTH: 10.5
            }
        }
    ]
}
Class.splasher_RG = {
    PARENT: "genericTank",
    LABEL: "Splasher",
    DANGER: 7,
    GUNS: [
        {
            POSITION: {
                LENGTH: 21,
                WIDTH: 7
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.lowPower, g.pelleter, { recoil: 1.15 }]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: {
                LENGTH: 10,
                WIDTH: 10,
                ASPECT: 1.4,
                X: 8
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, { size: 0.92 }, g.blaster]),
                TYPE: "bullet"
            }
        }
    ]
}
Class.sprayer_RG = {
    PARENT: "genericTank",
    LABEL: "Sprayer",
    DANGER: 7,
    GUNS: [
        {
            POSITION: {
                LENGTH: 22.5,
                WIDTH: 8.5,
                ASPECT: 1.4
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.lowPower, g.pelleter, { recoil: 1.15 }]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: {
                LENGTH: 12,
                WIDTH: 10,
                ASPECT: 1.4,
                X: 8
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.focal]),
                TYPE: "bullet"
            }
        }
    ]
}
Class.spreadRifle_RG = {
    PARENT: "genericTank",
    LABEL: "Spread Rifle",
    DANGER: 7,
    BODY: {
        FOV: base.FOV * 1.225
    },
    GUNS: [
        ...weaponMirror([{
            POSITION: {
                LENGTH: 11,
                WIDTH: 4,
                X: 6,
                Y: 4,
                DELAY: 1
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.rifle, g.crossbow, { recoil: 0.5 }]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: {
                LENGTH: 11,
                WIDTH: 4,
                X: 3,
                Y: 5,
                DELAY: 2/3
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.rifle, g.crossbow, { recoil: 0.5 }]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: {
                LENGTH: 11,
                WIDTH: 4,
                Y: 6,
                DELAY: 1/3
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.rifle, g.crossbow, { recoil: 0.5 }]),
                TYPE: "bullet"
            }
        }], 0),
        {
            POSITION: {
                LENGTH: 22,
                WIDTH: 7
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.rifle]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: {
                LENGTH: 14,
                WIDTH: 10.5
            }
        }
    ]
}
Class.tornado_RG = {
    PARENT: "genericTank",
    LABEL: "Tornado",
    DANGER: 7,
    GUNS: weaponArray([
        {
            POSITION: {
                LENGTH: 16,
                WIDTH: 5.5,
                ANGLE: 90,
                DELAY: 0.75
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.gunner, g.cyclone]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: {
                LENGTH: 16,
                WIDTH: 5.5,
                ANGLE: 30,
                DELAY: 0.5
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.gunner, g.cyclone]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: {
                LENGTH: 16,
                WIDTH: 5.5,
                ANGLE: 60,
                DELAY: 0.25
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.gunner, g.cyclone]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: {
                LENGTH: 16,
                WIDTH: 5.5
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.gunner, g.cyclone]),
                TYPE: "bullet"
            }
        }
    ], 3)
}
Class.triBlaster_RG = {
    PARENT: "genericTank",
    LABEL: "Tri-Blaster",
    DANGER: 7,
    GUNS: [
        ...weaponMirror({
            POSITION: {
                LENGTH: 5,
                WIDTH: 12,
                ASPECT: 1.2,
                X: 8,
                ANGLE: 25,
                DELAY: 0.5
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, { size: 0.92 }, g.blaster, g.tripleShot, { recoil: 0.2 }]),
                TYPE: "bullet"
            }
        }, 0),
        {
            POSITION: {
                LENGTH: 7.5,
                WIDTH: 12,
                ASPECT: 1.2,
                X: 8
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, { size: 0.92 }, g.blaster, g.tripleShot]),
                TYPE: "bullet"
            }
        }
    ]
}

// Tierless
Class.protector_RG = {
    PARENT: "genericTank",
    LABEL: "Protector",
    GUNS: [
        {
            POSITION: {
                LENGTH: 18,
                WIDTH: 12
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, g.setTrap]),
                TYPE: "setTrap",
                STAT_CALCULATOR: "block"
            }
        },
        {
            POSITION: {
                LENGTH: 17,
                WIDTH: 13
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pounder]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: {
                LENGTH: 13,
                WIDTH: 13,
                ASPECT: -1.3
            }
        }
    ]
}

// Class Tree
Class.blaster_RG.UPGRADES_TIER_3 = ["triBlaster_RG", "splasher_RG"]
Class.gatlingGun_RG.UPGRADES_TIER_3 = ["sprayer_RG", "accurator_RG", "halfNHalf_RG"]
Class.machineFlank_RG.UPGRADES_TIER_3 = ["machineTriple_RG", "halfNHalf_RG"]
Class.rifle_RG.UPGRADES_TIER_3 = ["sniperRifle_RG", "rifleGuard_RG", "spreadRifle_RG"]

if (add_to_main_class_tree) {
    //Class.twin.UPGRADES_TIER_2
        Class.tripleShot.UPGRADES_TIER_3.push("triBlaster_RG")
    //Class.sniper.UPGRADES_TIER_2
        Class.assassin.UPGRADES_TIER_3.push("buttbuttin_RG")
    Class.machineGun.UPGRADES_TIER_2.push("blaster_RG", "gatlingGun_RG", "machineFlank_RG")
        Class.sprayer.UPGRADES_TIER_3.push("sprayer_RG", "splasher_RG")
    //Class.flankGuard.UPGRADES_TIER_2
        if (!replace_newer_classes) { Class.hexaTank.UPGRADES_TIER_3.push("tornado_RG") }
    //Class.pounder.UPGRADES_TIER_2
        Class.destroyer.UPGRADES_TIER_3.push("blower_RG")
}

if (public_retrograde_menu) {
    Config.daily_tank = {
        tank: "arrasMenu_retrograde",
        tier: 3,
        ads: { enabled: false }
    }
}

if (replace_newer_classes) {
    for (let i = 0; i < Class.twin.UPGRADES_TIER_3.length; i++) {
        let string = Class.twin.UPGRADES_TIER_3[i];
        if (string === "musket") {
            Class.twin.UPGRADES_TIER_3.splice(i, 1)
        }
    }
    for (let i = 0; i < Class.doubleTwin.UPGRADES_TIER_3.length; i++) {
        let string = Class.doubleTwin.UPGRADES_TIER_3[i];
        if (string === "tripleTwin") {
            Class.doubleTwin.UPGRADES_TIER_3.splice(i, 1, "quadTwin_RG")
            Class.menu_unused.UPGRADES_TIER_0.push("tripleTwin")
        }
    }
    for (let i = 0; i < Class.sniper.UPGRADES_TIER_2.length; i++) {
        let string = Class.sniper.UPGRADES_TIER_2[i];
        if (string === "rifle") {
            Class.sniper.UPGRADES_TIER_2.splice(i, 1, "rifle_RG")
            Class.menu_unused.UPGRADES_TIER_0.push("rifle")
        }
    }
    for (let i = 0; i < Class.sniper.UPGRADES_TIER_3.length; i++) {
        let string = Class.sniper.UPGRADES_TIER_3[i];
        if (string === "bushwhacker") {
            Class.sniper.UPGRADES_TIER_3.splice(i, 1)
            Class.menu_unused.UPGRADES_TIER_0.push("bushwhacker")
        }
    }
    for (let i = 0; i < Class.marksman.UPGRADES_TIER_3.length; i++) {
        let string = Class.marksman.UPGRADES_TIER_3[i];
        if (string === "revolver") {
            Class.marksman.UPGRADES_TIER_3.splice(i, 1)
        }
    }
    for (let i = 0; i < Class.machineGun.UPGRADES_TIER_2.length; i++) {
        let string = Class.machineGun.UPGRADES_TIER_2[i];
        if (string === "sprayer") {
            Class.machineGun.UPGRADES_TIER_2.splice(i, 1)
            Class.menu_unused.UPGRADES_TIER_0.push("sprayer")
        }
    }
    for (let i = 0; i < Class.flankGuard.UPGRADES_TIER_3.length; i++) {
        let string = Class.flankGuard.UPGRADES_TIER_3[i];
        if (string === "tripleTwin") {
            Class.flankGuard.UPGRADES_TIER_3.splice(i, 1)
        }
    }
    for (let i = 0; i < Class.hexaTank.UPGRADES_TIER_3.length; i++) {
        let string = Class.hexaTank.UPGRADES_TIER_3[i];
        if (string === "cyclone") {
            Class.hexaTank.UPGRADES_TIER_3.splice(i, 1, "tornado_RG")
        }
    }
    for (let i = 0; i < Class.triAngle.UPGRADES_TIER_3.length; i++) {
        let string = Class.triAngle.UPGRADES_TIER_3[i];
        if (string === "phoenix") {
            Class.triAngle.UPGRADES_TIER_3.splice(i, 1)
        }
    }
}
