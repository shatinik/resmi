// const mysql = require('./database/mysql');
import { MySQL as mysql } from './database/mysql'
const requests = require('../configs/requests');

let requester = {
  getRequest: function (api, method) {
    for (let i = 0; i < requests.length; i++) {
      if (requests[i].api === api) {
        for (let j = 0; j < requests[i].methods.length; j++) {
          if (requests[i].methods[j].method === method) {
            return requests[i].methods[j];
          }
        }
      }
    }
    return false;
  },
  /**
   * Функция преобразования полей(получения значений) типа 'variable' и 'request' в 'static'.
   * Замена "путей к значениям" на сами значения.
   */
  loadConditions: function (req, res, next, where, title, callback, banQueries) {
    let variable = {};
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
            variable[field] = {type: 'static', value: req.query[value]};
          } else {
            return false; // Error::NotEnoughData
          }
          break;
        case 'stat':
        case 'static':
          variable[field] = where[field];
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
                  variable[field] = {type: 'static', value: values[0]};
                } else {
                  variable[field] = {type: 'static', value: values};
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
          variable[field] = where[field];
          break;
      }
    }

    if (subquery) {
      if (requester.getReqest(subquery.value)) {
        this.query(subquery.value, req, res, next, function (req, res, next, rows) {
          variable[subquery_field].rows = rows;
          requester.query(title, req, res, next, callback, variable);
        }, subquery.where);
        return;
      } else {
        console.log(`Error. Request '${title}' have undefined subrequest on field '${subquery_field}'`);
        return false;
      }
    }
    return variable;
  },

  query: function (title, req, res, next, callback, _w) {
    let str = title.split("#");
    let api = str[0];
    let method = str[1];
    let request = requester.getRequest(api, method);
    if (request) {
      let table = request.table;
      let type = request.type;
      let where = {};
      let fields = request.fields;
      let query = mysql(table);

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

        let variable = this.loadConditions(req, res, next, where, title, callback);

        // Static принимает значение false в случае, если запрос содержит подзапросы, либо в случае возникновения ошибки в процессе обработки запроса
        if (variable) {
          switch (type) {
            case 'select':
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
        } else if (variable === false) {
          console.log(`Error was catched while executing of '${title}'`);
          next();
          return;
        } else {
          return;
        }

        // Применение параметров where к запросу
        for (let field in variable) {
          let value = variable[field].value;
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
          res.json({
            "kind": global.service + '#' + api + method + 'Response',
            "items": rows
          });
          next();
        });
      }
    } else {
      console.log(`Wrong request name '${title}'`);
      next();
    }
  }
};

module.exports = {
  /*
   Запрос к БД.
   query: <api>#<method> согласно файлу /configs/requests
   req, res, next - передаются из функции-инициатора
   callback - необязательный параметр, function (req, res, next, rows), где rows - полученный результат.
   При отсутствии callback - результат будет выведен в виде json
   */
  query: function (query, req, res, next, callback) {
    requester.query(query, req, res, next, callback);
  },

  /*
   Генерирует ответ API согласно шаблону Resmi из входных данных
   */
  generateApiResult: function (apiData) {
    var apiResult = {};

    apiResult.kind = apiData.kind;
    apiResult.responseMessage = apiData.responseMessage;

    if (apiData.items === undefined) {
      apiResult.totalResults = 0;
      apiResult.items = [];
    } else {
      if (apiData.totalResults === undefined) {
        apiResult.totalRetults = apiData.items.length;
      } else {
        apiResult.totalResults = apiData.totalResults;
      }
      apiResult.items = apiData.items;
    }

    return apiResult;
  }
}