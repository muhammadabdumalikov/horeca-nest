import { UserRoles } from '../enum/user.enum';

export interface IUser {
  id: string;
  phone: string;
  first_name: string;
  last_name: string;
  role: UserRoles;
  auth_status: boolean;
  otp: string;
}
