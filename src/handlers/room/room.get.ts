import { Handler } from '../../handler';

export class RoomGet extends Handler {

    public isRoomExist(): void {
        /*
            Существует ли комната
            api.site.com/v1/room/isRoomExist?id=1
        */
    }
    
    public getById(): void {
        /*
            Берётся информация о комнате
            api.site.com/v1/room/getInfoById?id=1&items=title,photo,author,currentVideo ...
        */
    }

    public getAllByCreatorId(): void {
        /*
            Возвращается список всех комнат по id создателя
            api.site.com/v1/room/getAllByCreatorId?creator_id=1&items=title,photo,author,currentVideo ...
        */
    }

}