module.exports = ({ Class, Config }) => {
    if (!Class.bot || !Array.isArray(Class.bot.CONTROLLERS)) return;
    if (Config.disable_wall_avoid_pathing) return;
    if (!Class.bot.CONTROLLERS.includes("wallAvoidGoal")) {
        Class.bot.CONTROLLERS.push("wallAvoidGoal");
    }
};
