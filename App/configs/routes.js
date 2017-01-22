/*
* If you want to make correct route
* DO NOT WRITE '/' AT THE END OF A PATH
* Exception: path is a just '/'
*/

module.exports.routes = [
	{
		path: '/api/rooms/get',
		type: 'get',
		controller: 'api_rooms',
		defaultAction: 'main',
		enableAllActions: true,
		enable: true
	}
];