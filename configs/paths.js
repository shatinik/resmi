module.exports = [
    {
        path: '/api/rooms/all',
        type: 'get', // 'post'
        request: 'rooms list',
        handler: 'example',
        // action: 'test',
    },
    {
        path: '/api/rooms',
        type: 'get', // 'post'
        request: 'rooms list',
        // request_attr: {},
        request_stat: { active: 1 },
        // handler: 'example',
        // action: 'test',
        // disabled: true
    },
    {
        path: '/api/test',
        type: 'get', // 'post'
        handler: 'example',
    }
];