module.exports = {
  maze_type: 1,
  smaze: true,
  food_types: [ // Possible food types outside the nest - ALL rare shapes with equal chance
    [1, [
      // All shiny shapes
      [100, "shinyEgg"], [100, "shinySquare"], [100, "shinyTriangle"], [100, "shinyPentagon"], [100, "shinyHexagon"],
      // All legendary shapes  
      [100, "legendaryEgg"], [100, "legendarySquare"], [100, "legendaryTriangle"], [100, "legendaryPentagon"], [100, "legendaryHexagon"],
      // All shadow shapes
      [100, "shadowEgg"], [100, "shadowSquare"], [100, "shadowTriangle"], [100, "shadowPentagon"], [100, "shadowHexagon"],
      // All rainbow shapes
      [100, "rainbowEgg"], [100, "rainbowSquare"], [100, "rainbowTriangle"], [100, "rainbowPentagon"], [100, "rainbowHexagon"],
      // All trans shapes
      [100, "transEgg"], [100, "transSquare"], [100, "transTriangle"], [100, "transPentagon"], [100, "transHexagon"],
      // Jewel
      [100, "jewel"]
    ]]
  ],
  food_types_nest: [ // Possible food types in the nest - ALL rare shapes with equal chance
    [1, [
      // All shiny pentagons and hexagons
      [100, "shinyPentagon"], [100, "shinyHexagon"],
      // All legendary pentagons and hexagons
      [100, "legendaryPentagon"], [100, "legendaryHexagon"],
      // All shadow pentagons and hexagons
      [100, "shadowPentagon"], [100, "shadowHexagon"],
      // All rainbow pentagons and hexagons
      [100, "rainbowPentagon"], [100, "rainbowHexagon"],
      // All trans pentagons and hexagons
      [100, "transPentagon"], [100, "transHexagon"]
    ]]
  ],
  // AI settings for maze - allow targeting through walls
  ai_lock_through_walls: true
};
