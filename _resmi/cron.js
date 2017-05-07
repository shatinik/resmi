/* 
	CronJob
	https://www.npmjs.com/package/cron
	npm install cron
*/
var CronJob = require('cron').CronJob;
/*
	The storage of events
*/
var events = require('../configs/cron');

function ResmiCron(CronJob, events) {
	this.run = function() {
		/*
			Cycle of creating new events
		*/
		for (var i = 0; i < events.length; i++) {
			try {
				new CronJob(
					events[i].pattern,
					events[i].runs,
					events[i].stops,
					events[i].start,
					events[i].timeZone
				);
			} catch(e) {
				console.log(`>> \"${events[i].title}\" is not valid`);
			}
		}
	}
}

module.exports = new ResmiCron(CronJob, events);