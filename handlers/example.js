module.exports = {
    test: function (req, res, next, rows) {
        res.json(rows);
        next();
    },
};
module.exports.default = module.exports.test;