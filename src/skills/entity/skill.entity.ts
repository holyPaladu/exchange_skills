import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Category } from '../../categories/entity/category.entity'; // Import the Category entity
import { User } from 'src/user/entity/user.entity';

@Entity('skills') // Name of the table
export class Skill {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @ManyToOne(() => Category, (category) => category.id, { eager: true })
  @JoinColumn({ name: 'category_id' }) // Column name in the skills table
  category: Category;

  // Add the relation to UserSkills
  @OneToMany(() => UserSkills, (userSkill) => userSkill.skill, {
    cascade: true, // Каскадное удаление
    onDelete: 'CASCADE', // Удалить связанные записи
  })
  userSkills: UserSkills[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

@Entity('user_skills')
export class UserSkills {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.userSkills)
  @JoinColumn({ name: 'user_id' }) // This column will store the foreign key
  user: User;

  @ManyToOne(() => Skill, (skill) => skill.userSkills, {
    onDelete: 'CASCADE', // Удалить при удалении Skill
  })
  @JoinColumn({ name: 'skill_id' }) // This column will store the foreign key
  skill: Skill;
}
