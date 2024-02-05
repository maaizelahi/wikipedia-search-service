import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BeforeInsert,
  OneToMany,
} from 'typeorm';
import * as bcrypt from 'bcrypt';

import { SearchHistory } from '../search/search-history.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  username: string;

  @Column()
  password: string;

  @BeforeInsert()
  async hashPassword() {
    // Hash the password before saving it to the database
    this.password = await bcrypt.hash(this.password, 10);
  }

  @OneToMany(() => SearchHistory, (searchHistory) => searchHistory.user)
  searchHistory: SearchHistory[];
}
