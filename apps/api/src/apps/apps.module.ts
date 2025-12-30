import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppEntity } from "./app.entity";
import { AccessRuleEntity } from "./access-rule.entity";
import { AppsController } from "./apps.controller";
import { AppsService } from "./apps.service";
import { AuthModule } from "../auth/auth.module";

@Module({
  imports: [TypeOrmModule.forFeature([AppEntity, AccessRuleEntity]), AuthModule],
  controllers: [AppsController],
  providers: [AppsService]
})
export class AppsModule {}
