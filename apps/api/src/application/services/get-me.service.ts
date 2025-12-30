import type { User } from "../../domain/entities";

export class GetMeService {
  execute(user: User): User {
    return user;
  }
}
