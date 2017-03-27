module.exports = {
    model: function (title) {
        if (title) {
            return require(`../../../models/${title}`);
        } else {
            return false;
        }
    }
}