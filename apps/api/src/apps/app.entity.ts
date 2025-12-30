import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";
import { AccessRuleEntity } from "./access-rule.entity";

@Entity({ name: "apps" })
export class AppEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ unique: true })
  slug!: string;

  @Column()
  name!: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ nullable: true })
  iconUrl?: string;

  @Column()
  targetUrl!: string;

  @OneToMany(() => AccessRuleEntity, (rule) => rule.app, { cascade: true })
  accessRules!: AccessRuleEntity[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
