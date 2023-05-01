import { Utility } from "src/utility/entities/utility.entity";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Map {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    name: string;

    @OneToMany(() => Utility, utility => utility.map)
    utilities: Utility[]

    @CreateDateColumn()
    createdAt: Date;
}
