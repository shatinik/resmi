import {Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn} from "typeorm";
import Playlist from './Playlist';

@Entity()
export default class Video {

    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(type => Playlist)
    @JoinColumn()
    playlist: Playlist;

    @Column("int")
    service: number;

    @Column("varchar")
    service_uid: number;
}