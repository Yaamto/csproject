import { Category } from "src/category/entities/category.entity";
import { Space } from "src/space/entities/space.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

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

    @CreateDateColumn()
    createdAt: Date;

}