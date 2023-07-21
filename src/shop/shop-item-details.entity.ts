import {
 BaseEntity, Column, Entity, OneToOne, PrimaryGeneratedColumn,
} from 'typeorm';
import { ShopItem } from './shop-item.entity';
import { ShopItemDetailsInterface } from '../types';

@Entity()
export class ShopItemDetails extends BaseEntity implements ShopItemDetailsInterface {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    nullable: true,
    default: null,
  })
  color: string;

  @Column({
    nullable: true,
    default: null,
  })
  weight: number;

  @OneToOne((type) => ShopItem)
  shopItem: ShopItem;
}
