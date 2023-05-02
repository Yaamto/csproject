import { Category } from "src/category/entities/category.entity";
import { Space } from "src/space/entities/space.entity";
import { User } from "src/user/entities/user.entity";
import { Map } from "src/map/entities/map.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Utility {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    title: string;

    @Column()
    description: string;

    @ManyToOne(() => Category, category => category.utilities)
    category: Category;

    @ManyToOne(() => Space, space => space.utilities)
    space: Space;
    
    @Column()
    path: string;

    @ManyToMany(() => User, user => user.utilities)
    users: User[];

    @ManyToOne(() => Map, map => map.utilities)
    map: Map;

    @CreateDateColumn()
    createdAt: Date;


}