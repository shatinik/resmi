import {Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn} from "typeorm";
import Playlist from './Playlist';

@Entity()
export default class Video {

    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(type => Playlist)
    @JoinColumn()
    playlist: Playlist;

    @Column("varchar")
    service: string;

    @Column("varchar")
    link: string;

    @Column("varchar")
    preview_picture_uri: string;
}