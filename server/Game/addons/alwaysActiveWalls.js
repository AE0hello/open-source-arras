module.exports = ({ Events }) => {
    Events.on("spawn", (entity) => {
        if (entity.type === "wall") {
            entity.alwaysActive = true;
        }
    });
};
