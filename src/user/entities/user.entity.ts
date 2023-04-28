import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    email: string;

    @Column({select: false})
    password: string;

    @Column()
    username: string;
    
    @Column({ default: false })
    admin: boolean;
    
    @Column({ nullable: true })
    profileImage: string;
}