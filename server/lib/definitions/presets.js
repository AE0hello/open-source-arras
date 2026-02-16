const {combineStats, weaponMirror} = require('./facilitators.js')
const g = require('./gunvals.js')
module.exports = {
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
