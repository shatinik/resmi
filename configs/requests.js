module.exports = [
    /*
        title: '', // query title
        table: '', // table
        where: {
            id: { type: 'variable', value: 'id' } // 'GET' / 'POST' значение в зависимости от связанного с запросом path.type
            action: { type: 'static', value: 1 } // Статическое значение
            owner: { type: 'query', value: 'other_query' } // Значения подзапроса
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
            author: { type: 'query', value: 'other query', field: 'id' }
        },
        fields: [
            'author',
            'title',
            'registered'
        ]
    },
    {
        title: 'other query',
        table: 'users',
        where: {
            id: { type: 'static', value: [1, 2] }
        },
        fields: [
            'id',
            'email',
            'username',
            'group'
        ]
    }
];