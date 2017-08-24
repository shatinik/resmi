import {Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn} from "typeorm";
import User from './User'
@Entity()
export default class Room {

    @PrimaryGeneratedColumn()
    id: number;

    @Column("varchar")
    title: string;

    @OneToOne(type => User)
    @JoinColumn()
    creator: User;
    creatorId: number; // typeorm don't use this field but it is the hack that hides warning in IDE

    @Column("int")
    views: number;

    @Column("varchar")
    picture_uri: string;

    @Column("varchar")
    global_uri: string;
}