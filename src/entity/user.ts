import "reflect-metadata";
import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    user_index!: number;
    @Column()
    user_id?: string;
    @Column()
    name?: string;
    @Column()
    token?: string;
    @Column()
    fcm_token?: string;
    @Column()
    device_log?: string;
}
