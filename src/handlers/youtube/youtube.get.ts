import Handler from '../../resmi/handler';
import Packet from '../../resmi/packet';
import * as https from 'https'

const YOUTUBE_API_KEY = 'AIzaSyAbIZfMG1JjJUjkGKuGaohb_u6VX109zl4';
const YOUTUBE_API_HOST = 'https://www.googleapis.com/youtube/';
const YOUTUBE_API_VERSION = 'v3';

export class YoutubeGet extends Handler {
    public getOneById(req, res, next) {
        // GET-параметр id
        let videoId = req.query.id;
        let packet = new Packet('youtube','getOneById');
        // Передан ли id
        if (videoId === undefined) {
            packet.error = 'messages.responseMessage.badRequest[0]';//replace
            res.json(packet);
            next();
            return;
        }

        // Проверка на корректность id
        if (videoId.length !== 11) {
            packet.error = 'messages.responseMessage.badRequest[1]';//replace
            res.json(packet);
            next();
            return;
        }

        // Путь к googleapis [videos(1) + snippet(2) + player(0) = 3 units]
        let apiPath = YOUTUBE_API_HOST
            + YOUTUBE_API_VERSION
            + '/videos?part=snippet,player&id='
            + videoId
            + '&key='
            + YOUTUBE_API_KEY;

        // Получение информации
        https.get(apiPath, function(response) {
            let resBody: any = '';

            response.on('data', function(data) {
                resBody += data;
            });

            response.on('end', function() {
                resBody = JSON.parse(resBody);

                if (resBody.pageInfo.totalResults === 0) {
                    packet.error = 'messages.responseMessage.nofFound';//replace
                    res.json(packet);
                    next();
                } else {
                    // packet.totalResults = resBody.pageInfo.totalResults;
                    packet.items = resBody.items;
                    res.json(packet);
                    next();
                }

                next();
            });
        });

    }

    public searchByQuery(req, res, next) {
        // GET-параметр q
        let searchQuery = req.query.q;
        // GET-параметр maxResults
        let maxResults = req.query.maxResults;
        let packet = new Packet('youtube','searchByQuery');

        // Переданы ли q
        if (searchQuery === undefined) {
            packet.error = 'errors.responseMessage.badRequest[0]';//replace
            res.json(packet);
            next();
            return;
        } else if (searchQuery.length < 3 || searchQuery.length > 255) {
            // Корректен ли q
            packet.error = 'messages.responseMessage.badRequest[1]';//replace
            res.json(packet);
            next();
            return;
        }

        // Передан ли maxResults
        if (maxResults === undefined) {
            packet.error = 'errors.responseMessage.badRequest[0]';//replace
            res.json(packet);
            next();
            return;
        } else if (maxResults < 1 || maxResults > 50) {
            packet.error = 'messages.responseMessage.badRequest[1]';//replace
            res.json(packet);
            next();
            return;
        }

        // Кодирование всех символов, кроме специальных и латиницы
        searchQuery = encodeURI(searchQuery);

        // Путь к googleapis [search(100) + snippet(2) = 102 units]
        let apiPath = YOUTUBE_API_HOST
            + YOUTUBE_API_VERSION
            + '/search?part=snippet&q='
            + searchQuery
            + '&maxResults='
            + maxResults
            + '&key='
            + YOUTUBE_API_KEY;

        // Получение информации
        https.get(apiPath, function(response) {
            let resBody: any = '';

            response.on('data', function(data) {
                resBody += data;
            });

            response.on('end', function() {
                resBody = JSON.parse(resBody);

                if (resBody.pageInfo.totalResults === 0) {
                    packet.error = 'messages.responseMessage.notFound';//replace
                    res.json(packet);
                    next();
                    return;
                } else {
                    packet.items = resBody.items;
                    res.json(packet);
                    next();
                    return;
                }
            });
        });
    }
}