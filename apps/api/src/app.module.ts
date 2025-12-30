import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule, getRepositoryToken } from "@nestjs/typeorm";
import { AppsController } from "./adapters/http/apps.controller";
import { AuthGuard } from "./adapters/http/auth.guard";
import { ListAppsForUserService } from "./application/services/list-apps-for-user.service";
import { GetMeService } from "./application/services/get-me.service";
import { AuthentikOIDCClaimsAdapter } from "./adapters/auth/authentik-claims.adapter";
import { JwtVerifier } from "./adapters/auth/jwt-verifier";
import { AppEntity } from "./adapters/typeorm/app.entity";
import { AccessRuleEntity } from "./adapters/typeorm/access-rule.entity";
import { TypeormAppRepository } from "./adapters/repositories/typeorm-app.repository";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
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
    }),
    TypeOrmModule.forFeature([AppEntity, AccessRuleEntity])
  ],
  controllers: [AppsController],
  providers: [
    GetMeService,
    {
      provide: AuthentikOIDCClaimsAdapter,
      useClass: AuthentikOIDCClaimsAdapter
    },
    {
      provide: JwtVerifier,
      inject: [ConfigService],
      useFactory: (config: ConfigService) =>
        new JwtVerifier(
          config.getOrThrow("OIDC_ISSUER"),
          config.getOrThrow("OIDC_AUDIENCE"),
          config.get("OIDC_JWKS_URL")
        )
    },
    {
      provide: TypeormAppRepository,
      inject: [getRepositoryToken(AppEntity)],
      useFactory: (repo) => new TypeormAppRepository(repo)
    },
    {
      provide: ListAppsForUserService,
      inject: [TypeormAppRepository],
      useFactory: (repo) => new ListAppsForUserService(repo)
    },
    {
      provide: AuthGuard,
      inject: [JwtVerifier, AuthentikOIDCClaimsAdapter],
      useFactory: (jwt, claims) => new AuthGuard(jwt, claims)
    }
  ]
})
export class AppModule {}
