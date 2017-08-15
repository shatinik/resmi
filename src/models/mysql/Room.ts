import {Entity, Column, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export default class Room {

    @PrimaryGeneratedColumn()
    id: number;

    @Column("varchar")
    title: string;

    @Column("int")
    creator_id: number;

    @Column("int")
    views: number;

    @Column("varchar")
    picture_uri: string;

    @Column("varchar")
    global_uri: string;
}