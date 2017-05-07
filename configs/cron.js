module.exports = [
    {
        title:    'just every seccond',
        pattern:  '* * * * * *',
        start:    true,
        timeZone: 'America/Los_Angeles',
        runs: function() {
            console.log('a seccond');
        },
        stops: function() {

        },
        onComplete: function() {

        }
    },
    {
        title:    '25 minute of every hour',
        pattern:  '* 25 * * * *',
        start:    true,
        timeZone: 'America/Los_Angeles',
        runs: function() {
            console.log('25 minute of every hour');
        },
        stops: function() {

        },
        onComplete: function() {
            
        }
    },
    {
        title:    '1-st seccond of every minute',
        pattern:  '1 * * * * *',
        start:    true,
        timeZone: 'America/Los_Angeles',
        runs: function() {
            console.log('1-st seccond of every minute');
        },
        stops: function() {

        },
        onComplete: function() {
            
        }
    }
];