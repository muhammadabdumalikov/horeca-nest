import { PersonType, UserRoles } from '../enum/user.enum';

export interface IUser {
  id: string;
  phone: string;
  first_name: string;
  last_name: string;
  legal_name: string;
  role: UserRoles;
  auth_status: boolean;
  super_user: string;
}

export interface IUpdateUser {
  first_name?: string;
  last_name?: string;
  person_type?: PersonType;
  legal_name?: string;
  additional_name?: string;
  address?: string;
}
