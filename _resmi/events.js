events = {
    accessDenied: function (req, res) {
        res.send('access denied');
    },
    
    /*
    * CanWeDid-function. Return false to stop the execution.
    */
    before: function (req, res, next) {
        var somethingWentWrong = false;

        if (somethingWentWrong) {
            events.accessDenied(req, res);
            return;
        }
    
        next(); // go to handler
    },

    after: function (req, res, next) {
        // Don't care what you'll do here. Answer was already send.
        // Maybe it's unusuable feature
        next();
    }
};

module.exports = events;