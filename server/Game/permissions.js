// OPERATOR LEVELS
/*
{
    level: 1 // All basic stuff
    level: 2 // All advanced stuff
    level: 3 // All stuff
} 
*/

// If your Discord username doesn't have a 4-digit tag anymore, leave it as #0000.

module.exports = [
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
        key: process.env.BETA_TESTER,
        discordID: "0",
        nameColor: "#ffffff",
        class: "arrasMenu_betaTester",
        level: 3,
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
