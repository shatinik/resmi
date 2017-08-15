import {Entity, Column, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export default class Video {

    @PrimaryGeneratedColumn()
    id: number;

    playlist_id: number;

    @Column("int")
    service: number;

    @Column("varchar")
    service_uid: number;
}