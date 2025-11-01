const {
    normal: ____,
    nexus_red: REDA,
    wall: WALL,
    base1: bas1,
    baseprotected1: bap1,
    atmg,
    nexus_portal_tile: prtl,
} = tileClass;

let nexus_room = [
    [ ____, ____, ____, ____, ____, ____, ____, ____, ____, ____, ____, ____, ____, ____, ____, ____, ____, atmg, ____, ____, ____, ____ ],
    [ ____, ____, ____, ____, ____, ____, ____, ____, ____, WALL, ____, ____, ____, ____, ____, ____, WALL, ____, ____, ____, ____, ____ ],
    [ ____, ____, atmg, ____, ____, ____, ____, ____, ____, ____, ____, ____, WALL, ____, ____, ____, WALL, ____, ____, ____, ____, ____ ],
    [ ____, ____, ____, ____, ____, ____, ____, ____, ____, ____, ____, ____, WALL, ____, ____, ____, ____, ____, ____, ____, WALL, ____ ],
    [ ____, WALL, WALL, WALL, WALL, WALL, WALL, WALL, WALL, WALL, ____, WALL, WALL, WALL, WALL, WALL, WALL, ____, ____, ____, ____, ____ ],
    [ ____, WALL, prtl, prtl, prtl, prtl, WALL, ____, ____, ____, ____, ____, WALL, prtl, prtl, prtl, WALL, ____, ____, ____, ____, ____ ],
    [ ____, WALL, prtl, prtl, prtl, prtl, WALL, WALL, WALL, ____, WALL, WALL, WALL, prtl, prtl, prtl, WALL, ____, WALL, ____, ____, ____ ],
    [ ____, WALL, prtl, prtl, prtl, prtl, WALL, ____, ____, ____, ____, ____, WALL, prtl, prtl, prtl, WALL, ____, ____, ____, ____, ____ ],
    [ ____, WALL, prtl, prtl, prtl, ____, WALL, ____, bas1, bas1, bas1, ____, WALL, prtl, prtl, prtl, WALL, ____, ____, ____, ____, WALL ],
    [ ____, WALL, prtl, prtl, prtl, ____, ____, ____, bas1, bap1, bas1, ____, ____, ____, prtl, prtl, WALL, ____, ____, ____, ____, ____ ],
    [ ____, WALL, prtl, prtl, prtl, prtl, WALL, ____ ,bas1, bas1, bas1, ____, WALL, prtl, prtl, prtl, WALL, ____, ____, ____, ____, ____ ],
    [ ____, WALL, prtl, ____, prtl, prtl, WALL, ____, ____, ____, ____, ____, WALL, prtl, prtl, prtl, WALL, ____, ____, ____, ____, ____ ],
    [ ____, WALL, WALL, ____, ____, WALL, WALL, WALL, WALL, ____, WALL, WALL, WALL, WALL, WALL, WALL, WALL, ____, ____, ____, ____, ____ ],
    [ ____, WALL, ____, ____, ____, WALL, prtl, prtl, prtl, ____, prtl, prtl, WALL, ____, ____, ____, WALL, WALL, WALL, ____, ____, ____ ],
    [ ____, WALL, ____, ____, ____, WALL, prtl, prtl, prtl, prtl, prtl, ____, WALL, ____, ____, ____, WALL, ____, ____, ____, ____, ____ ],
    [ ____, WALL, ____, ____, ____, WALL, prtl, prtl, prtl, prtl, prtl, ____, REDA, ____, ____, ____, WALL, ____, ____, ____, ____, ____ ],
    [ ____, WALL, ____, ____, ____, WALL, prtl, prtl, prtl, prtl, prtl, ____, WALL, ____, ____, ____, WALL, ____, ____, ____, WALL, ____ ],
    [ ____, WALL, WALL, WALL, WALL, WALL, WALL, WALL, WALL, WALL, WALL, WALL, WALL, WALL, WALL, WALL, WALL, ____, atmg, ____, WALL, ____ ],
    [ ____, ____, ____, ____, ____, ____, ____, ____, ____, ____, ____, ____, ____, ____, ____, ____, ____, ____, ____, ____, ____, ____ ],
]

module.exports = nexus_room;