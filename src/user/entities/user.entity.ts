import { Space } from "../../space/entities/space.entity";
import { BeforeInsert, Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";

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

    @ManyToMany(() => Space, space => space.users)
    spaces: Space[];
  
    @OneToMany(() => Space, space => space.creator)
    createdSpaces: Space[];
}