﻿module.exports = [
    /**
        path: '/api/rooms', // URL
        type: 'get', // 'post'
        request: 'rooms list', // Связано с request.title
        where: { } // Переопределение или определение новых параметров для where запроса
        handler: 'example', // Обозначает срабатываемый обработчик
        [action: 'test',] // вызываемый action, по умолчанию вызывается handler.default
        [disabled: true] // отключает работу роута

        Примечание: В определении всегда должен присутствовать хотя бы один из элементов where, либо хотя бы handler
    */
    {
        path: '/api/rooms/all',
        type: 'get',
        request: 'rooms list',
        handler: 'example',
    },
    {
        path: '/api/rooms',
        type: 'get',
        request: 'rooms list'
    },
    {
        path: '/api/room',
        type: 'get',
        request: 'rooms list',
        where: {
            id: { type: 'variable', value: 'id' },
        }
    },
    {
        path: '/api/user/add',
        type: 'get',
        request: 'user add',
    },
    {
        path: '/api/users',
        type: 'get',
        request: 'users list',
    },
    {
        path: '/api/user/delete',
        type: 'get',
        request: 'user delete',
    },
    {
        path: '/api/test',
        type: 'get',
        handler: 'example',
    }
];