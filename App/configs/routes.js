/*
* If you want to make correct route
* DO NOT WRITE '/' AT THE END OF A PATH
* Exception: path is a just '/'
*/

module.exports.routes = [
    {
        path: '/example',
        type: 'get',
        control_module: 'HandledAction',
        enabled: true,

        handler: 'example',
        defaultAction: 'main',
    },
    {
        path: '/api/rooms/get',
        type: 'get',
        control_module: 'DataQuery',
        enabled: true,

        query: 'roomsByEnumID',
    },
    {
        path: '/api/rooms',
        type: 'get',
        control_module: 'HandledAction',
        enabled: true,

        handler: 'room',
        defaultAction: 'edit',
    },
];