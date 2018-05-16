import Packet        from './packet';
//import * as SocketIO from 'socket.io'
import http2        from 'http2'
import logger       from '../logger'
import querystring  from 'querystring'

const {
    HTTP2_HEADER_METHOD,
    HTTP2_HEADER_PATH,
    HTTP2_HEADER_STATUS,
    HTTP2_HEADER_CONTENT_TYPE,
    HTTP2_HEADER_SCHEME,
    HTTP2_HEADER_AUTHORITY
} = http2.constants;

const log = logger ('net');

export default class Handler {

    static async getFunctionParameters (func) {

        let STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
        let ARGUMENT_NAMES = /([^\s,]+)/g;

        let fnStr = func.toString().replace(STRIP_COMMENTS, '');
        let result = fnStr.slice(fnStr.indexOf('(')+1, fnStr.indexOf(')')).match(ARGUMENT_NAMES);

        if(result === null) { result = []; }

        return result;
    }
    
    static async parameterMapping (params, functionParameters) {

        let _params = [];
        for (let i = 0; i < functionParameters.length; i++) {
            
            let param = params[functionParameters[i]];
            if ( param != null ) {
                _params[i] = param;
            } else {
                throw new Error('Not all parameters have been transferred');
            }            
        }
        
        return _params;
    }

    static searchParamsToObject(searchParams) {
        let search = {};
        for (const iterator of searchParams) {
            let key = iterator[0];
            let value = iterator[1];
            if (!search[key]) {
                 search[key] = value;
            } else {
                if (!(search[key] instanceof Array)) {
                    let oldValue = search[key];
                    search[key] = [];
                    search[key].push(oldValue);
                }
                search[key].push(value);
            }
        }
        return search;
    }

    static formParamsObj(body, search, method) {
        let params = {};
        if (method == 'GET') {
            Object.assign(params, body, search);
        } else {
            Object.assign(params, search, body);
        }
        return params;
    }

    static getHandlerAndMethod(pathname) {
        let handler = '';
        let method = '';
        let i = pathname.length - 1;
        while (i) {
            if (pathname[i] == '/') {
                handler = pathname.substring(1, i);
                method  = pathname.substring(i + 1, pathname.length);
                break;
            } else {
                i--; 
            }
        }
        return { handler, method }
    }

    static async runBy(headers, body) {
        const {
            pathname,
            searchParams
        } = new URL(headers[HTTP2_HEADER_PATH], 'https://doesnotmatter.host');

        const {
            handler,
            method
        } = Handler.getHandlerAndMethod(pathname);

        // possibly is a security bug
        // test via telnet or smth else by passing next URL
        // https://127.0.0.1:1337/../git?countTag=master
        const handlerPath = `../handlers/${handler}.mjs`;

        let module = await import(handlerPath);
        try {
            if (!module[method]) {
                throw new Error(`Method ${method} not exists in ${handlerPath}`);
            } else if (typeof module[method] != 'function') {
                throw new Error(`${method} in ${handlerPath} is not a Function`);
            }
            let functionParameters = await Handler.getFunctionParameters(module[method]);
            let search = Handler.searchParamsToObject(searchParams);
            let allParams = Handler.formParamsObj(body, search, headers[HTTP2_HEADER_METHOD]);
            let expectedParams = await Handler.parameterMapping(allParams, functionParameters);
            return await module[method](...expectedParams);
        } catch (err) {
            switch (typeof err) {
                case 'string': {
                    throw new Error(err);
                }
                case 'object': {
                    if (err instanceof Error) {
                        throw err;
                    } else {
                        throw 'Unknown error';
                    }
                }
            }
        }
    }

    static async run(req, res, next, handler, action) {
        if (!this.obj) {
            this.obj = new this();
        }
        let packet = new Packet(handler, action);
        this.obj[action](req, res, function(packet) {
            if (packet.error) {
                log.debug(packet.error);
            }
            if (req.new_token) {
                packet.token = req.new_token;
            }
            res.status(200).json(packet);
            next();
        }, packet);
    }

    static async runSocket(data, handler, action, socket) {
        if (!this.obj) {
            this.obj = new this();
        }
        let packet = new Packet(handler, action);
        await this.obj[action](data, packet, socket);
    }
}