import util     from 'util'

const room = 'name: ROOMtest'

export default class RoomGet {

    constructor() {}

    getAll = async (id) => {
        return room;
    }
    
    addNote = async (room) => {
        let response = `ROOMHANDLER: ${room.name}`;
        return response;
    }
}