import {
  BaseEntity, Column, Entity, Index, PrimaryGeneratedColumn,
} from 'typeorm';
import { CacheItemInterface } from '../types';

@Entity()
export class CacheItem extends BaseEntity implements CacheItemInterface {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    length: 100,
  })
  @Index()
  controllerName: string;

  @Column()
  @Index()
  actionName: string;

  @Column({
    type: 'longtext',
  })
  dataJson: string;

  @Column({
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;
}
