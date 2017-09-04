import {Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn} from "typeorm";
import IPlaylist from '../../shared/interfaces/models/IPlaylist'
import Room from './Room'

@Entity()
export default class Playlist extends IPlaylist {

    @PrimaryGeneratedColumn()
    id: number;

    @Column("varchar")
    title: string;

    @OneToOne(type => Room)
    @JoinColumn()
    room: Room;

    @Column("int")
    delete_ban: boolean;

    @Column("varchar")
    preview_picture_url: string;
}