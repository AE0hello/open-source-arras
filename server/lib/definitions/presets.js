const {combineStats, weaponMirror} = require('./facilitators.js')
const g = require('./gunvals.js')
module.exports = {
	// GUNS
	guns: {
		bird: [
			...weaponMirror({
				POSITION: {
					LENGTH: 16,
					WIDTH: 9,
					ANGLE: 153,
					DELAY: 0.1
				},
				PROPERTIES: {
					SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard, g.triAngle, g.thruster, { recoil: 0.5 }]),
					TYPE: "bullet",
					LABEL: "Thruster"
				}
			}),
			{
				POSITION: {
					LENGTH: 18,
					WIDTH: 9,
					ANGLE: 180,
					DELAY: 0.6
				},
				PROPERTIES: {
					SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard, g.triAngle, g.thruster, { recoil: 0.5 }]),
					TYPE: "bullet",
					LABEL: "Thruster"
				}
			}
		],
		rearPelleter: [
			...weaponMirror({
				POSITION: {
					LENGTH: 19,
					WIDTH: 2,
					Y: -2.5,
					ANGLE: 180
				},
				PROPERTIES: {
					SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.power, g.twin, { recoil: 4 }, { recoil: 1.8 }]),
					TYPE: "bullet",
				},
			}, {delayIncrement: 0.5}),
			{
				POSITION: {
					LENGTH: 12,
					WIDTH: 11,
					ANGLE: 180
				}
			}
		],
		triAngle: weaponMirror({
			POSITION: {
				LENGTH: 16,
				WIDTH: 8,
				ANGLE: 150,
				DELAY: 0.1
			},
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard, g.triAngle, g.thruster]),
				TYPE: "bullet",
				LABEL: "thruster"
			}
		}),
		booster: weaponMirror([
			{
				POSITION: {
					LENGTH: 14,
					WIDTH: 8,
					ANGLE: 135,
					DELAY: 0.6
				},
				PROPERTIES: {
					SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard, g.triAngle, g.thruster]),
					TYPE: "bullet",
					LABEL: "thruster"
				}
			},
			{
				POSITION: {
					LENGTH: 16,
					WIDTH: 8,
					ANGLE: 150,
					DELAY: 0.1
				},
				PROPERTIES: {
					SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard, g.triAngle, g.thruster]),
					TYPE: "bullet",
					LABEL: "thruster"
				}
			}
		])
	},

	// ON
	on: {
		retrograde_self_destruct: {
			event: 'define',
			handler: ({ body }) => {
				if (Config.retrograde && body.socket && !body.socket.permissions) {
					body.sendMessage("WARNING: This tank will self-destruct in 10 seconds!");
					setTimeout(() => {
						body.destroy();
					}, 10_000)
				}
			}
		}
	},

	// Functions
	makeAuto: {
		mega: {
			type: "megaAutoTurret", size: 12
		},
		ultra: {
			type: "ultraAutoTurret", size: 14
		},
		triple: {
			size: 6.5, x: 5.2, angle: 0, total: 3
		},
		penta: {
			size: 5.2, x: 6.5, angle: 0, total: 5
		},
		hepta: {
			size: 4, x: 6.5, angle: 0, total: 7
		}
	},
	makeDrive: {
		swarm: {
			hatType: "triangleHat", hatSize: 8, hatAngle: 180
		}
	},
	makeOver: {
		hybrid: {
			count: 1, independent: true, cycle: false
		}
	}
}
