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
    }
];