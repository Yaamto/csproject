import { Expose, Transform } from "class-transformer";
import { CategoryDto } from "src/category/dto/category.dto";
import { Category } from "src/category/entities/category.entity";
import { SpaceDto } from "src/space/dto/space.dto";
import { Space } from "src/space/entities/space.entity";

export class UtilityDto {
    @Expose()
    id: string;
    
    @Expose()
    title: string;

    @Expose()
    description: string;

    @Expose()
    @Transform(({ obj }) => obj.category )
    category: Category;

    @Expose()
    @Transform(({ obj }) => obj.space )
    space: Space;

    @Expose()
    path: string;

    @Expose()
    createdAt: Date;
}