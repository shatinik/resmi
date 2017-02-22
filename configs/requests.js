module.exports = [
    {
        title: 'Some Query', // only for logging
        table: 'cookies', // печенье
        attributes: { // значения, на основании которых будет проводиться выборка WHERE
            id: 'id', // значение передаётся пользователем через get/post
        },
        static: {
            type: 'с вареньем', // статичные значения, не передаются пользователем
        },
        format: {
            title: true,
            cost: true
        }
    },
];