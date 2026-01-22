module.exports = ({ Class }) => {
    if (!Class.bot || !Array.isArray(Class.bot.CONTROLLERS)) return;
    if (Class.bot.CONTROLLERS.includes("ecosystem")) return;
    const index = Class.bot.CONTROLLERS.indexOf("nearestDifferentMaster");
    if (index !== -1) {
        Class.bot.CONTROLLERS.splice(index + 1, 0, "ecosystem");
    } else {
        Class.bot.CONTROLLERS.push("ecosystem");
    }
};
