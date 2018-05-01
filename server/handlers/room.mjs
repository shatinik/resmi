import util     from 'util'

const room = 'name: ROOMtest'

export default class RoomGet {

    constructor() {}

    getAll = async (id) => {
        console.log('ROMM handler.. id = ' + id);
        return room;
    }
}