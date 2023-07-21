import { BaseEntity, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class DiscountCode extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
}
