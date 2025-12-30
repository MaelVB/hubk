import type { App } from "../../domain/entities";

export interface AppRepositoryPort {
  findAppsForClaims(groups: string[], roles: string[]): Promise<App[]>;
}
