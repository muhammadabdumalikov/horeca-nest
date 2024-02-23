import { MeasureType } from "../enum/product.enum"

export interface IProduct {
  id: string,
  company_id: string,
  category_id: string,
  measure: MeasureType,
  name_uz: string,
  name_ru: string,
  barcode: string,
  image: string,
  product_count: number,
  count_in_block: number,
  description: string,
  count_price: number,
  block_price: number,
  discount_price: number,
  is_deleted: boolean,
  created_at: Date,
  updated_at: Date,
}