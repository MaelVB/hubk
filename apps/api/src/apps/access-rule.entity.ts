import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn
} from "typeorm";
import { AppEntity } from "./app.entity";

export type AccessRuleClaimType = "GROUP" | "ROLE";

@Entity({ name: "access_rules" })
export class AccessRuleEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  claimType!: AccessRuleClaimType;

  @Column()
  claimValue!: string;

  @Column({ name: "appId" })
  appId!: string;

  @ManyToOne(() => AppEntity, (app) => app.accessRules, { onDelete: "CASCADE" })
  @JoinColumn({ name: "appId" })
  app!: AppEntity;
}
