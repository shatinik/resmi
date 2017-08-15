import {Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn} from "typeorm";

@Entity()
export default class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column("varchar")
    name: string;

    @Column("varchar")
    email: string;

    @CreateDateColumn()
    created_at: string;

    // @Column({
    //     type: "datetime",
    //     default: 'CURRENT_TIMESTAMP(6)'
    // })
    // last_auth: string;

    @Column("varchar")
    picture_full_uri: string;

    @Column("varchar")
    picture_cut_uri: string;

    @Column("int")
    service: number;

    @Column("varchar")
    service_uid: number;

}