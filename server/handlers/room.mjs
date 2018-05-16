import util     from 'util'
const room = 'name: ROOMtest'


export async function getAll(id) {
    return room;
};

export async function addNote(room) {
    let response = `ROOMHANDLER: ${room.name}`;
    return response;
};