// OPERATOR LEVELS
// - level: 1 // basic stuff
// - level: 2 // level 1 + advanced stuff
// - level: 3 // level 2 + everything else

// If your Discord username doesn't have a 4-digit tag after it, leave it as #0000.
module.exports = [
    {
        key: process.env.BETA_TESTER,
        discordID: "0",
        nameColor: "#ffffff",
        class: "arrasMenu_betaTester",
        level: 1,
        name: "unnamed#0000",
        note: "note here"
    },
    {
        key: process.env.SHINY,
        discordID: "0",
        nameColor: "#ffffff",
        class: "arrasMenu_shinyMember",
        level: 2,
        name: "unnamed#0000",
        note: "note here"
    },
    {
        key: process.env.YOUTUBER,
        discordID: "0",
        nameColor: "#ffffff",
        class: "arrasMenu_youtuber",
        level: 2,
        name: "unnamed#0000",
        note: "note here"
    },
    {
        key: process.env.DEVELOPER,
        discordID: "0",
        nameColor: "#ffffff",
        class: "developer",
        administrator: true,
        level: 3,
        name: "unnamed#0000",
        note: "note here"
    },
]
