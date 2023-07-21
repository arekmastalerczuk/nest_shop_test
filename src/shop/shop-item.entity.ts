import {
  BaseEntity, Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn,
} from 'typeorm';
import { ShopItemInterface } from '../types';
import { ShopItemDetails } from './shop-item-details.entity';
import { ItemInBasket } from '../basket/item-in-basket.entity';

@Entity()
export class ShopItem extends BaseEntity implements ShopItemInterface {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    length: 100,
  })
  name: string;

  @Column({
    type: 'text',
    nullable: true,
    default: null,
  })
  description: string | null;

  @Column({
    type: 'decimal',
    precision: 6,
    scale: 2,
  })
  price: number;

  @Column({
    default: null,
    nullable: true,
  })
  photoFn: string;

  @Column({
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @OneToOne((type) => ShopItemDetails)
  @JoinColumn()
  details: ShopItemDetails;

  @OneToMany((type) => ItemInBasket, (entity) => entity.shopItem)
  itemsInBasket: ItemInBasket[];
}
