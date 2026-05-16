// OPERATOR LEVELS
// - level: 1 // basic stuff
// - level: 2 // level 1 + advanced stuff
// - level: 3 // level 2 + everything else

// todo: be more specific here

module.exports = [
    {
        key: process.env.BETA_TESTER,
        level: 1,
        class: "arrasMenu_betaTester",
        nameColor: "#ffffff",
        note: "note here"
    },
    {
        key: process.env.SHINY,
        level: 2,
        class: "arrasMenu_shinyMember",
        nameColor: "#ffffff",
        note: "note here"
    },
    {
        key: process.env.YOUTUBER,
        level: 2,
        class: "arrasMenu_youtuber",
        nameColor: "#ffffff",
        note: "note here"
    },
    {
        key: process.env.DEVELOPER,
        administrator: true,
        level: 3,
        class: "developer",
        nameColor: "#ffffff",
        note: "note here"
    },
]
