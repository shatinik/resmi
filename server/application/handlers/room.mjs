import util     from 'util'
import Room from '../models/room';
const room = 'name: ROOMtest'

export async function getAll(id) {
    return room;
};

export async function addNote(room) {
    let response = `ROOMHANDLER: ${room.name}`;
    return response;
};

export async function isRoomExist(roomId) {
    return JSON.stringify((await Room.findOne({ uniqName: roomId })));
}

export async function onUserJoin(user, roomId) {
    let room = await Room.findOne({ uniqName: roomId });
    room.generalize("members"); // membersId ~> membersObj
    await user.joinRoom(room); // логика при присоединении
    return JSON.stringify(room); // то что нужно фронту
}