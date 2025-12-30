import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import type { IdpAdapter } from "@hubk/auth-core";
import { createAuthentikAdapter } from "@hubk/idp-authentik";
import { AuthGuard } from "./auth.guard";
import { AuthService } from "./auth.service";

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: "IDP_ADAPTER",
      inject: [ConfigService],
      useFactory: (config: ConfigService): IdpAdapter =>
        createAuthentikAdapter({
          issuer: config.getOrThrow("OIDC_ISSUER"),
          audience: config.getOrThrow("OIDC_AUDIENCE"),
          jwksUrl: config.get("OIDC_JWKS_URL"),
          appsEndpoint: config.get("OIDC_APPS_ENDPOINT")
        })
    },
    {
      provide: AuthService,
      inject: ["IDP_ADAPTER"],
      useFactory: (adapter: IdpAdapter) => new AuthService(adapter)
    },
    {
      provide: AuthGuard,
      inject: [AuthService],
      useFactory: (service: AuthService) => new AuthGuard(service)
    },
    {
      provide: "IDP_APPS",
      inject: ["IDP_ADAPTER"],
      useFactory: (adapter: IdpAdapter) => adapter.apps
    }
  ],
  exports: [AuthGuard, AuthService, "IDP_APPS"]
})
export class AuthModule {}
