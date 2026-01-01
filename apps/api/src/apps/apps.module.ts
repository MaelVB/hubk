import { Module, type DynamicModule } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppEntity } from "./app.entity";
import { AccessRuleEntity } from "./access-rule.entity";
import { AppsController } from "./apps.controller";
import { AppsService } from "./apps.service";
import { AuthModule } from "../auth/auth.module";

@Module({})
export class AppsModule {
  static register(options: { dbEnabled: boolean }): DynamicModule {
    const imports = [AuthModule, ConfigModule];

    if (options.dbEnabled) {
      imports.unshift(TypeOrmModule.forFeature([AppEntity, AccessRuleEntity]));
    }

    return {
      module: AppsModule,
      imports,
      controllers: [AppsController],
      providers: [AppsService]
    };
  }
}
