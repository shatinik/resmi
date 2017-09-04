import {Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn} from "typeorm";
import IRoom from '../../shared/interfaces/models/IRoom'
import {RoomTypes, RoomVisibility, RoomAccess} from '../../shared/interfaces/models/IRoom'
import User from './User'

@Entity()
export default class Room extends IRoom {

    @PrimaryGeneratedColumn()
    id: number;

    @Column("varchar")
    title: string;

    @OneToOne(type => User)
    @JoinColumn()
    creator: User;

    @Column("int")
    views: number;

    @Column("int")
    type: RoomTypes;

    @Column("int")
    visibility: RoomVisibility;

    @Column("int")
    access: RoomAccess;

    @Column("varchar")
    picture_uri: string;

    @Column("varchar")
    global_uri: string;
}