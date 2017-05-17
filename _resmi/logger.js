const writers = require(`../configs/${global.env}/writers`);
const listeners = require(`../configs/${global.env}/listeners`);
const util = require('util');
const fs = require('fs');

/*
    Обработка запросов на запись сообщений в разные ресурсы(консоль, бд, файлы)
    Сообщения уровня ниже заданного в конфиге - отсеиваются
*/
function process(_listener, message, level) {
    if (!listeners[_listener]) {
        log.error('logger', `Try to write with undefined listener '${_listener}'`);
        return;
    }
    let listener = listeners[_listener];
    let filename = fileFormat(listener.file);

    if (level >= listener.level) {
        for (let i = 0; i < listener.writers.length; i++) {
            if (!writers[listener.writers[i]]) {
                log.error('logger', `Try to write with undefined writer '${listener.writers[i]}'`);
                return;
            }
            let writer = writers[listener.writers[i]];

            if (level >= writer.level) {
                switch (writer.type) {
                    case 1: // console
                        writeConsole(message, level);
                        break;
                    case 2: // db
                        writeDB(message);
                        break;
                    case 3: // file
                        if (filename) {
                            writeFile(message, filename);
                        } else {
                            log.error('logger', `Listener '${_listener}' haven't a valid filename to write logs into a file`);
                        }
                        break;
                    default:
                        log.error('logger', `Unknown writer.level in '${listener.writers[i]}'`)
                }
            }
        }
    }
}

/*
    Функция вставки даты в имя файла, где это необходимо
*/
function fileFormat(file) {
    if (file) {
        if (file.search('%s') > 0) {
            let date = new Date().toLocaleDateString();
            return util.format(file, date);
        } else {
            return listener.file;
        }
    } else {
        return '';
    }
}

/*
    Вывод сообщения в консоль в соответствии с цветом уровня(типа) сообщения
*/
function writeConsole(message, level) {
    let prefix = '';
    let postfix = '\x1b[0m';

    switch (level) {
        case 1:
            prefix = '\x1b[32m';
            break;
        case 2:
            prefix = '\x1b[90m';
            break;
        case 3:
            prefix = '\x1b[37m';
            break;
        case 4:
            prefix = '\x1b[33m';
            break;
        case 5:
            prefix = '\x1b[31m';
            break;
        case 6:
            prefix = '\x1b[35m';
            break;
    }

    console.log(prefix + message + postfix);
}

/*
    Запись сообщения в файл с указанием времени записи
*/
function writeFile(message, file) {
    let prefix = new Date().toLocaleString().replace(/T/, ' ').replace(/\..+/, '').toString() + ' ';
    let postfix = '\r\n';

    fs.appendFile('logs/' + file, prefix + message + postfix, function (err) {
        if (err) {
            log.error("logger", err);
            return;
        }

        log.info('logger', `Line added into file '${file}'`);
    });
}

function writeDB(message) {
    // CODE HERE
}

let log = {
    trace: function (listener, message) {
        process(listener, '[TRACE] ' + message, 1);
    },

    debug: function (listener, message) {
        process(listener, '[DEBUG] ' + message, 2);
    },

    info: function (listener, message) {
        process(listener, '[INFO] ' + message, 3);
    },

    warn: function (listener, message) {
        process(listener, '[WARN] ' + message, 4);
    },

    error: function (listener, message) {
        process(listener, '[ERROR] ' + message, 5);
    },

    fatal: function (listener, message) {
        process(listener, '[FATAL] ' + message, 6);
    }
};

module.exports = log;
if (!fs.existsSync('logs')) {
    fs.mkdirSync('logs');
    log.info('logger', 'Created \'/logs\' folder');
}