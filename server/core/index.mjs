import http2    from 'http2';
import URLUtil  from 'url';
import fs       from 'fs';
import Packet   from './packet'
import logger   from '../logger'
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
        try {
            await this.httpServer.listen(port);
            log.info(`Listening on port: ${port}`);
        } catch (e) {
            log.error(e);
        }
    }

    constructor() {
        try {
            this.httpServer = http2.createSecureServer({
                key: fs.readFileSync('./localhost-privkey.pem'),
                cert: fs.readFileSync('./localhost-cert.pem')
            });
            this.httpServer.on('error', (err) => log.error(err));
              
            this.httpServer.on('stream', (stream, headers, flags) => {
                let Packet = new Packet();
                const myURL = new URL(headers[HTTP2_HEADER_PATH], 'https://doesnotmatter.host');
                stream.respond({
                    'content-type': 'text/html',
                    ':status': 200
                });
            });
        } catch (e) {
            log.error(e);
        }
    }
}