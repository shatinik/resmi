module.exports = [
    {
        path: '/api/rooms',
        type: 'get', // 'post'
        request: 'rooms list',
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
    }
];