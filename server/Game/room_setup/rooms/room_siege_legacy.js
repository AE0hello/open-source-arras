const {
  normal: _,
  nest: n,
  wall: WALL,
  sbase1: s,
  outBorder: o,
  atmg: A,
  bossSpawn: b
} = tileClass;

const room_siege = [
  [o , o , o , o , o , o , o , o , o , o , o , o , o , o , o , o , o , o , o , o , o],
  [o , o , o , o , o , o , o , o ,WALL,WALL,WALL,WALL,WALL, o , o , o , o , o , o , o , o],
  [o , o , A , o , o , o , o , o ,WALL, o , o , o ,WALL, o , o , o , o , o , A , o , o],
  [o , o , o , o , o , o , o , o ,WALL, b , b , b ,WALL, o , o , o , o , o , o , o , o],
  [o , o , o , o , o ,WALL,WALL,WALL,WALL, b , b , b ,WALL,WALL,WALL,WALL, o , o , o , o , o],
  [o , o , o , o ,WALL,WALL, _ , _ ,WALL, _ , _ , _ ,WALL, _ , _ ,WALL,WALL, o , o , o , o],
  [o , o , o , o ,WALL, _ , _ , _ , _ , _ , _ , _ , _ , _ , _ , _ ,WALL, o , o , o , o],
  [o , o , o , o ,WALL, _ , _ , s , _ , _ , s , _ , _ , s , _ , _ ,WALL, o , o , o , o],
  [o ,WALL,WALL,WALL,WALL,WALL, _ , _ , _ , _ , _ , _ , _ , _ , _ ,WALL,WALL,WALL,WALL,WALL, o],
  [o ,WALL, o , b , b , _ , _ , _ , _ , _ , n , _ , _ , _ , _ , _ , b , b , o ,WALL, o],
  [o ,WALL, o , b , b , _ , _ , s , _ , n , _ , n , _ , s , _ , _ , b , b , o ,WALL, o],
  [o ,WALL, o , b , b , _ , _ , _ , _ , _ , n , _ , _ , _ , _ , _ , b , b , o ,WALL, o],
  [o ,WALL,WALL,WALL,WALL,WALL, _ , _ , _ , _ , _ , _ , _ , _ , _ ,WALL,WALL,WALL,WALL,WALL, o],
  [o , o , o , o ,WALL, _ , _ , s , _ , _ , s , _ , _ , s , _ , _ ,WALL, o , o , o , o],
  [o , o , o , o ,WALL, _ , _ , _ , _ , _ , _ , _ , _ , _ , _ , _ ,WALL, o , o , o , o],
  [o , o , o , o ,WALL,WALL, _ , _ ,WALL, _ , _ , _ ,WALL, _ , _ ,WALL,WALL, o , o , o , o],
  [o , o , o , o , o ,WALL,WALL,WALL,WALL, b , b , b ,WALL,WALL,WALL,WALL, o , o , o , o , o],
  [o , o , o , o , o , o , o , o ,WALL, b , b , b ,WALL, o , o , o , o , o , o , o , o],
  [o , o , A , o , o , o , o , o ,WALL, o , o , o ,WALL, o , o , o , o , o , A , o , o],
  [o , o , o , o , o , o , o , o ,WALL,WALL,WALL,WALL,WALL, o , o , o , o , o , o , o , o],
  [o , o , o , o , o , o , o , o , o , o , o , o , o , o , o , o , o , o , o , o , o]
];

module.exports = room_siege;
