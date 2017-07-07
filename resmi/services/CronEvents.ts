/*
	CronJob
	https://www.npmjs.com/package/cron
	npm install cron
*/
import { CronJob } from 'cron'

/*
 The storage of IEvents
 */
import { CronEvents } from '../../configs/cron'

export function run() {
	/*
	 Cycle of creating new IEvents
	 */
	for (let i = 0; i < CronEvents.length; i++) {
		try {
			new CronJob(
				CronEvents[i].pattern,
				CronEvents[i].runs,
				CronEvents[i].stops,
				CronEvents[i].start,
				CronEvents[i].timeZone
			);
		} catch(e) {
			console.log(`>> \"${CronEvents[i].title}\" is not valid`);
		}
	}
}