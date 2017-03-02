module.exports = [
    /*
        title: '', // query title
        // TODO: Использовать поле type для определения типа запроса(выборка, добавление, обновление, редактирование) и реализовать их.
        type: '', // 'select', 'insert', 'update', 'delete'
        table: '', // table
        where: {
            id: { type: 'variable', value: 'id' } // 'GET' / 'POST' значение в зависимости от связанного с запросом path.type
            action: { type: 'static', value: 1 } // Статическое значение
            owner: { type: 'query', value: 'other_query' field: 'id'} // Значения подзапроса и значения поля, которое будет подставляться
        },
        fields: [
            'author',
            'title',
            'registered'
        ]
    */
    {
        title: 'rooms list',
        table: 'rooms',
        where: {
            creatorID: {
                type: 'query',
                value: 'users list',
                field: 'id',
                where: {
                    id: { type: 'static', value: 1 }
                }
            }
        },
        fields: [
            'creatorID',
            'title'
        ]
    },
    {
        title: 'users list',
        table: 'users',
        fields: [
            'id',
            'email',
            'username',
            'password'
        ]
    }
];