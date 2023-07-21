import {
  BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn,
} from 'typeorm';
import { ItemInBasket } from '../basket/item-in-basket.entity';
import {Role} from '../types';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    length: 255,
  })
  email: string;

  @Column({
    default: false,
  })
  emailVerified: boolean;

  @Column({
    length: 50,
  })
  nickname: string;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.GUEST,
  })
  roles: Role;

  @Column()
  pwdHash: string;

  @Column({
    nullable: true,
    default: null,
  })
  currentTokenId: string | null;

  @OneToMany((type) => ItemInBasket, (entity) => entity.user)
  itemsInBasket: ItemInBasket[];
}
