import http2        from 'http2'
import URLUtil      from 'url'
import fs           from 'fs'
import Packet       from './packet'
import logger       from '../logger'
import util         from 'util'
import MainHandler  from '../handlers/main.mjs'
import querystring  from 'querystring'

const log = logger('system');
const mainHandler = new MainHandler();
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

        try {
            this.httpServer.on('stream', async (stream, headers, flags) => {
                //let Packet = new Packet();
                const myURL = new URL(headers[HTTP2_HEADER_PATH], 'https://doesnotmatter.host');

                stream.respond({
                    'content-type': 'text/html',
                    ':status': 200
<<<<<<< HEAD
                });
                
                let query;
                let i = myURL.pathname.length - 2;
                while (i) {
                    if ( myURL.pathname[i] == '/' ) {
                        query = {
                            handler:    myURL.pathname.substring(0, i),
                            method:     myURL.pathname.substring(i + 1, myURL.pathname.length - 1),
                            type:       headers[HTTP2_HEADER_METHOD],
                            params:     myURL.searchParams
                        }
                        break;
                    } else { i--; }
                    
                }    

                let response = await mainHandler.moduleConnection(query);                
                stream.end(response);                                         
=======
                });                

                if (headers[HTTP2_HEADER_METHOD] == 'GET') {
                    try {
                        let response = await mainHandler.moduleConnection(myURL, null);  
                        stream.end(response);
                    } catch (err) {
                        stream.end('The request failed'); 
                    }  
                } else if (headers[HTTP2_HEADER_METHOD] == 'POST') {
                    let body = '';                    
                    stream.on('data', function (data) {
                        body += data.toString();
                    });
    
                    stream.on('end', () => {                        
                        mainHandler.moduleConnection(myURL, querystring.parse(body))
                            .then(response => {
                                stream.end(response);
                            })
                            .catch(err => {
                                stream.end('The request failed');
                            });
                    });
                }                              
>>>>>>> remotes/origin/handler-auto-loader
            });            
        } catch (err) {
            log.error(err);
        }
    }

    constructor() {
        try {
            this.httpServer = http2.createSecureServer({
                    key: fs.readFileSync('./localhost-privkey.pem'),
                    cert: fs.readFileSync('./localhost-cert.pem')}
            );

            this.httpServer.on('error', (err) => log.error(err));
        } catch (e) {
            log.error(e);
        }
    }
}