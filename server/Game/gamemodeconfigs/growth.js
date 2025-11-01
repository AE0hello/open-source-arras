module.exports = {
    LEVEL_CAP: 1000,
    GROWTH: true,
    LEVEL_SKILL_POINT_FUNCTION: level => {
        if (level <= 40) return 1;
        if (level <= 45 && (level & 1) == 1) return 1;
        if (level <= 51 && (level % 2) == 1) return 1;
        if (level % 10 == 1) return 1;
        return 0;
    },
};