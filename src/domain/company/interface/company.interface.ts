import { IListPage } from "src/shared/interface/list.interface";

export interface ICreateCompany {
  name_uz: string;
  name_ru: string;
  country_uz: string;
  country_ru: string;
}

export interface ICompanyList extends IListPage {
  is_deleted?: string;
}