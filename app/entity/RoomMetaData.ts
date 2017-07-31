import {Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn} from "typeorm";
import {Room} from "./Room";

@Entity()
export class RoomMetadata {

  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(type => Room)
  @JoinColumn()
  photo: Room;
}