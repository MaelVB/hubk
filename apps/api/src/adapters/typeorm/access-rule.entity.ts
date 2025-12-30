import {
  Column,
  Entity,
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

  @ManyToOne(() => AppEntity, (app) => app.accessRules, { onDelete: "CASCADE" })
  app!: AppEntity;
}
