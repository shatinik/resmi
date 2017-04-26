module.exports = {
    /*
    * CanWeDid-function. Return false to stop the execution.
    */
    before: function(req, res, next) {

        let somethingWentWrong = false;

        if (somethingWentWrong) {
            return false;
        }
    
        next(); // go to handler
    },

    after: function(req, res) {
        // Don't care what you'll do here. Answer was already send.
        // Maybe it's unusuable feature
    },
}