<<<<<<< HEAD
import logger       from '../logger'

=======
import http2        from 'http2'
import logger       from '../logger'

const {
    HTTP2_HEADER_METHOD,
    HTTP2_HEADER_PATH,
    HTTP2_HEADER_STATUS,
    HTTP2_HEADER_CONTENT_TYPE,
    HTTP2_HEADER_SCHEME,
    HTTP2_HEADER_AUTHORITY
  } = http2.constants;

>>>>>>> remotes/origin/handler-auto-loader
const log = logger('system');

export default class Main {

    constructor() {}

<<<<<<< HEAD
    async moduleConnection(query) {
        let {handler, method, type, params} = query;
        let Module = await import (`./${handler}.mjs`);

        try {
            let module = new Module.default();
            return await module.mapping(method, params);
        } catch (err) {
            log.error(err);
=======

    static async getFunctionParameters (func) {

        let STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
        let ARGUMENT_NAMES = /([^\s,]+)/g;

        let fnStr = func.toString().replace(STRIP_COMMENTS, '');
        let result = fnStr.slice(fnStr.indexOf('(')+1, fnStr.indexOf(')')).match(ARGUMENT_NAMES);

        if(result === null) { result = []; }

        return result;
    }
    
    static async parameterMapping (myURL, functionParameters) {

        let params = [];

        for (let i = 0; i < functionParameters.length; i++) {
            
            let param = myURL.searchParams.get(functionParameters[i]);
            if ( param != null ) {
                params[i] = param;
            } else {
                throw new Error('Not all parameters have been transferred'); 
                break;
            }            
        }
        
        return params;
    }

    async moduleConnection(myURL, body) {

        let handler;
        let method;

        let i = myURL.pathname.length - 1;
        while (i) {
            if ( myURL.pathname[i] == '/' ) {
                handler = myURL.pathname.substring(0, i);
                method  = myURL.pathname.substring(i + 1, myURL.pathname.length);
                break;
            } else { i--; }   
        }  

        let Module = await import (`./${handler}.mjs`);
        let module = new Module.default();

        if (body == null) {
            try {
                if (typeof module[method] == 'function') {
                    let functionParameters = await Main.getFunctionParameters(module[method]);
                    let params = await Main.parameterMapping(myURL, functionParameters);
                    return await module[method](...params);
                } else { 
                    throw new Error('Incorrect method specified'); 
                }
            } catch (err) {
                log.error(err);
                throw new Error(err);
            }
        } else {
            try {
                if (typeof module[method] == 'function') {
                    return await module[method](body);
                } else { 
                    throw new Error('Incorrect method specified'); 
                }
            } catch (err) {
                log.error(err);
                throw new Error(err);
            }
>>>>>>> remotes/origin/handler-auto-loader
        }
    }
}