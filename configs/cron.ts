export let CronEvents:CronEvent[] = [
    {
        title:    'just every seccond',
        pattern:  '* * * * * *',
        start:    true,
        timeZone: 'America/Los_Angeles',
        runs: function() {
            console.log('a second');
        },
        stops: function() {

        },
        onComplete: function() {

        }
    }
];