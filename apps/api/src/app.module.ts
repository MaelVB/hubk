import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppsModule } from "./apps/apps.module";
import { AppEntity } from "./apps/app.entity";
import { AccessRuleEntity } from "./apps/access-rule.entity";

const getAppsMode = (): string => String(process.env.APPS_MODE ?? "hybrid").toLowerCase();
const isDbEnabled = (): boolean => getAppsMode() !== "dynamic";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env'
    }),
    ...(isDbEnabled()
      ? [
          TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (config: ConfigService) => ({
              type: "postgres",
              host: config.getOrThrow("POSTGRES_HOST"),
              port: Number(config.getOrThrow("POSTGRES_PORT")),
              username: config.getOrThrow("POSTGRES_USER"),
              password: config.getOrThrow("POSTGRES_PASSWORD"),
              database: config.getOrThrow("POSTGRES_DB"),
              entities: [AppEntity, AccessRuleEntity],
              synchronize: config.get("TYPEORM_SYNCHRONIZE") === "true"
            })
          })
        ]
      : []),
    AppsModule.register({ dbEnabled: isDbEnabled() })
  ]
})
export class AppModule {}
