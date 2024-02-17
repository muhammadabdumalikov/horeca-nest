import { UserRoles } from "src/domain/user/enum/user.enum";

export interface IListPage {
  offset?: number;
  limit?: number;
}

export interface ICurrentUser {
  id: string;
  auth_status: boolean;
  role: UserRoles;
}