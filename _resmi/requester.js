const knex = require('knex')({
    client: 'mysql',
    connection: {
        host: '127.0.0.1',
        user: 'root',
        password: '',
        database: 'videosos',
        charset: 'utf8'
    }
});
const requests = require('../configs/requests');

module.exports = {
    /**
    * Функция преобразования полей(получения значений) типа 'variable' и 'request' в 'static'.
    * Замена "путей к значениям" на сами значения.
    */
    loadConditions: function (req, res, next, where, title, callback, banQueries) {
        let static = {};
        let subquery = false;
        let subquery_field = '';

        for (let field in where) {
            let value = where[field].value;
            let type = where[field].type;

            switch (type) {
                case 'var':
                case 'variable':
                    if (req.query[value]) {
                        // Преобразование объекта 'variable' в 'static'
                        static[field] = { type: 'static', value: req.query[value] };
                    } else {
                        return false; // Error::NotEnoughData
                    }
                    break;
                case 'stat':
                case 'static':
                    static[field] = where[field];
                    break;
                case 'query':
                    if (banQueries) {
                        console.log(`Trying to execute ${title} with subquery while subqueries are banned`); 
                        return false; // Error::WrongField
                    }
                    if (!subquery) {
                        let _subquery = where[field];
                        if (_subquery.field) {

                            // Параметр rows создаётся только после выполнения подзапроса
                            if (_subquery.rows) {
                                let count = _subquery.rows.length;
                                let values = [];
                                let value = 0;
                                for (let i = 0; i < count; i++) {
                                    // Формирование массива из значений поля, которое нужно получить
                                    values[i] = _subquery.rows[i][_subquery.field];
                                }

                                // Преобразование объекта типа 'query' в 'static'
                                if (values.length == 1) {
                                    static[field] = { type: 'static', value: values[0] };
                                } else {
                                    static[field] = { type: 'static', value: values };
                                }
                                _subquery.rows = undefined;
                                break;
                            } else {
                                subquery = _subquery;
                                subquery_field = field;
                            }
                        } else {
                            console.log(`Error. Subrequest '${field}' in '${title}' don't have a name of resulting field. Request cannot be processed`);
                            return false;
                        }
                    }
                    static[field] = where[field];
                    break;
            }
        }
        
        if (subquery) {
            if (this.getConfig(subquery.value)) {
                this.query(subquery.value, req, res, next, function (req, res, next, rows) {
                    static[subquery_field].rows = rows;
                    module.exports.query(title, req, res, next, callback, static);
                }, subquery.where);
                return;
            } else {
                console.log(`Error. Request '${title}' have undefined subrequest on field '${subquery_field}'`);
                return false;
            }
        }
        return static;
    },

    modelCheck: function (static, model) {
        console.log(static);
        for (let field in static) {
            if (static[field].type === 'static') {
                if (model[field] !== undefined) {
                    if (!static[field].value.match(model[field])) {
                        console.log('Error::UnexpectedInputValue', static[field].value.match(model[field]));
                        return false; // Error::UnexpectedInputValue
                    }
                }
            }
        }
        return true;
    },

    query: function (title, req, res, next, callback, _w) {
        let request = this.getConfig(title);
        if (request) {
            let table = request.table;
            let type = request.type;
            let where = {};
            let fields = request.fields;
            let query = knex(table);
            let model = this.getModel(request.model);

            // Совмещение исходных полей where с данными, переданными через параметр "_w"
            if (request.where) {
                where = Object.assign(request.where);
            }
            if (where) {
                where = Object.assign(where, _w);
            }

            if (type === 'insert') {
                let data = this.loadConditions(req, res, next, fields, false, false, true);
                if (data) {
                    if (model) {
                        if (!this.modelCheck(data, model)) {
                            next();
                            return;
                        }
                    }
                    let _model = {};
                    for (let field in data) {
                        _model[field] = data[field].value;
                    }
                    query.insert(_model);
                } else {
                    next(); // Error::NotEnoughData
                    return;
                }
            } else {

                let static = this.loadConditions(req, res, next, where, title, callback);

                // Static принимает значение false в случае, если запрос содержит подзапросы, либо в случае возникновения ошибки в процессе обработки запроса
                if (static) {
                    switch (type) {
                        case 'select':
                            if (model) {
                                if (!this.modelCheck(static, model)) {
                                    next();
                                    return;
                                }
                            }
                            if (fields && fields.length > 0) {
                                let count = fields.length;
                                for (let i = 0; i < count; i++) {
                                    query.select(fields[i]);
                                }
                            }
                            break;
                        case 'update':
                            let data = this.loadConditions(req, res, next, fields, false, false, true);
                            if (data) {
                                if (model) {
                                    if (!this.modelCheck(data, model)) {
                                        next();
                                        return;
                                    }
                                }
                                for (let field in data) {
                                    query.update(field, data[field].value);
                                }
                            } else {
                                if (data === false) {
                                    console.log(`Error was catched while executing of '${title}'`);
                                    next(); // Error::InvalidQuery_SubqueriesAreNotAllowed
                                }
                                return;
                            }
                            break;
                        case 'delete':
                            query.del();
                            break;
                    }
                } else if (static === false) {
                    console.log(`Error was catched while executing of '${title}'`);
                    next();
                    return;
                } else {
                    return;
                }

                // Применение параметров where к запросу
                for (let field in static) {
                    let value = static[field].value;
                    if (value instanceof Array) {
                        query.whereIn(field, value);
                    } else {
                        query.where(field, value);
                    }
                }
            }

            if (callback) {
                query.then(function (rows) {
                    callback(req, res, next, rows);
                });
            } else {
                query.then(function (rows) {
                    res.json(rows);
                    next();
                });
            }
        } else {
            console.log(`Wrong request name '${title}'`);
            next();
        }
    },

    getConfig: function (title) {
        for (let i = 0; i < requests.length; i++) {
            if (requests[i].title === title) {
                return requests[i];
            }
        }
        return false;
    },

    getModel: function (title) {
        if (title) {
            return require(`../models/${title}`);
        } else {
            return false;
        }
    }
};