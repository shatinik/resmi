module.exports = [
    {
        title: 'rooms list', // only for logging
        table: 'rooms', // печенье
        /*
        attributes: { // значения, на основании которых будет проводиться выборка WHERE
            id: 'id', // значение передаётся пользователем через get/post
        },
        */
        /*
        static: {
            active: 1, // статичные значения, не передаются пользователем
        },
        */
        format: {
            author: true,
            title: true,
            registered: true
        }
    },
];