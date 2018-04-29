import util     from 'util'

const room = 'name: ROOMtest'

export default class RoomGet {

    getAll = async => {
        return room
    }

    emergency = async => {
        //console.log(util.inspect(import.meta));
        return 'Error in parameters'
    }

}