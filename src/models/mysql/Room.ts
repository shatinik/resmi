import {Entity, Column, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class Room {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 255,
    type: 'varchar'
  })
  urlAdress: string;

  @Column("text")
  title: string;

  @Column("int")
  creator_id: number;

  @Column("text")
  photo: string;

  @Column("text")
  currentVideo: string;
}