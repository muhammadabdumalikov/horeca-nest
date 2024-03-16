import { IListPage } from "src/shared/interface/list.interface";

export interface ICreateCompany {
  name: string;
  country_uz: string;
  country_ru: string;
}

export interface ICompanyList extends IListPage {
  is_deleted?: string;
}