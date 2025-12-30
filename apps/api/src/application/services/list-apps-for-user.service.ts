import type { App } from "../../domain/entities";
import type { AppRepositoryPort } from "../ports/app-repository.port";

export class ListAppsForUserService {
  constructor(private readonly appRepository: AppRepositoryPort) {}

  async execute(groups: string[], roles: string[]): Promise<App[]> {
    return this.appRepository.findAppsForClaims(groups, roles);
  }
}
