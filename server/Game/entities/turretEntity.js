class turretEntity {
    constructor(position, bond) {
        this.color = new Color(16);
        this.borderless = false;
        this.drawFill = true;
        this.control = {
            target: new Vector(0, 0),
            goal: new Vector(0, 0),
            main: false,
            alt: false,
            fire: false,
            power: 0,
        };
        // Bind prop
        this.bond = bond;
        this.bond.props.push(this);
        // Get my position.
        if (Array.isArray(position)) {
            position = { 
                SIZE: position[0], 
                X: position[1], 
                Y: position[2], 
                ANGLE: position[3], 
                ARC: position[4], 
                LAYER: position[5] 
            };
        }
        position.SIZE ??= 10;
        position.X ??= 0;
        position.Y ??= 0;
        position.ANGLE ??= 0;
        position.ARC ??= 360;
        position.LAYER ??= 0;
        let _off = new Vector(position.X, position.Y);
        this.bound = { 
            size: position.SIZE / 20, 
            angle: position.ANGLE * Math.PI / 180, 
            direction: _off.direction, 
            offset: _off.length / 10, 
            arc: position.ARC * Math.PI / 180, 
            layer: position.LAYER
        };
        // Initalize.
        this.facing = 0;
        this.x = 0;
        this.y = 0;
        this.size = 1;
        this.realSize = 1;
        this.settings = {};
        this.upgrades = [];
        this.guns = new Map();
        this.turrets = new Map();
        this.props = new Map();
    }
}