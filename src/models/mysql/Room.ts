import {Entity, Column, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export default class Room {

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
  creatorId: number;

  @Column("text")
  photo: string;

  @Column("text")
  currentVideo: string;
}