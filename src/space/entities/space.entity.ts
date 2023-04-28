import { User } from "../../user/entities/user.entity";
import { BeforeInsert, Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Space {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    description: string;

    @ManyToOne(() => User, user => user.createdSpaces)
    creator: User;
  
    @ManyToMany(() => User, user => user.spaces)
    @JoinTable()
    users: User[];
    
}
