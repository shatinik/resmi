import util     from 'util'

const room = 'name: ROOMtest'

export default class RoomGet {

    constructor() {}
<<<<<<< HEAD

    mapping = async (method, params) => {
        let success = false;

        switch (method) {
            case 'getAll':
                success = true;
                return await this.getAll();
                break;
            default:
                if (!success) { return await this.emergency(); }
        } 
    }

    getAll = async => {
        return room
    }

    emergency = async => {
        return 'Error in parameters'
=======

    getAll = async (id) => {
        return room;
    }
    
    addNote = async (room) => {
        let response = `ROOMHANDLER: ${room.name}`;
        return response;
>>>>>>> remotes/origin/handler-auto-loader
    }
}