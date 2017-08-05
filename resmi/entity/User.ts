import {Entity, Column, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class User {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 255,
    type: 'varchar'
  })
  login: string;

  @Column("text")
  password: string;

  @Column("int")
  service: number;
}