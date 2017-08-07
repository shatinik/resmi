import {Entity, Column, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class User {

  @PrimaryGeneratedColumn()
  id: number;

  @Column("int")
  service: number;

  @Column("varchar")
  service_uid: number;
}