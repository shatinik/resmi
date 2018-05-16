import http2        from 'http2'
import URLUtil      from 'url'
import fs           from 'fs'
import Packet       from './packet'
import logger       from '../logger'
import util         from 'util'
import Handler  from './handler'
import querystring  from 'querystring'

const log = logger('system');
const {
    HTTP2_HEADER_METHOD,
    HTTP2_HEADER_PATH,
    HTTP2_HEADER_STATUS,
    HTTP2_HEADER_CONTENT_TYPE,
    HTTP2_HEADER_SCHEME,
    HTTP2_HEADER_AUTHORITY
  } = http2.constants;

const {
    URL
} = URLUtil;

export default class ResmiHTTP2 {
    get httpServer() { return this._httpServer; }
    set httpServer(value) { this._httpServer = value; return this._httpServer; }

    async listen(port = 1337) {
        await this.httpServer.listen(port);
        log.info(`Listening on port: ${port}`);
    }

    static onError(error) {
        log.error(error);
    }

    static chooseParser(content_type) {
        switch (content_type) {
            case 'application/x-www-form-urlencoded':
                return querystring.parse;
            case 'application/json': 
                return JSON.parse;
            default: 
                throw new Error(`Content-type ${content_type} is not accepted`);
        }
    }

    static onEnd(stream, headers) {
        let body = '';

        stream.on('data', function (data) {
            body += data.toString();
        });

        return async function () {
            let response = '';
            try {
                if (headers[HTTP2_HEADER_CONTENT_TYPE] == undefined) {
                    headers[HTTP2_HEADER_CONTENT_TYPE] = 'application/x-www-form-urlencoded';
                }
                let parse = ResmiHTTP2.chooseParser(headers[HTTP2_HEADER_CONTENT_TYPE]);
                let parsedBody = parse(body);
                response = await Handler.runBy(headers, parsedBody);
            } catch (err) {
                log.error(err);
                response = err.toString();
            }
            stream.end(response);
        }
    }
    
    static onStream(stream, headers, flags) {
        stream.respond({
            'content-type': 'text/html',
            ':status': 200
        });
        stream.on('end', ResmiHTTP2.onEnd(stream, headers));
    }

    constructor() {
        try {
            this.httpServer = http2.createSecureServer({
                    key: fs.readFileSync('./localhost-privkey.pem'),
                    cert: fs.readFileSync('./localhost-cert.pem')}
            );
            this.httpServer.on('error', ResmiHTTP2.onError);
            this.httpServer.on('stream', ResmiHTTP2.onStream);
        } catch (e) {
            log.error(e);
        }
    }
}