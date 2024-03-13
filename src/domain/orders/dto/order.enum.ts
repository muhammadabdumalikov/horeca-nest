export enum OrderStatus {
  REGISTERED = '1',
  DELIVERY_PROCESS = '2',
  DELIVERED = '3',
  REJECTED = '4',
  PARTIALLY_PAID = '5',
  FULLY_PAID = '6',
  IN_WAREHOUSE = '7'
}

//                           DELIVERY_PROCESS
//                           FULLY_PAID
// REGISTERED -> REJECTED -> PARTIALLY_PAID -> DELIVERED

export enum PaymentTypesEnum {
  DEBT = '65e6fd80b308214264495c20',
  CASH = '65e6fd4cb308214264495c1e',
  CARD = '65e6fd30b308214264495c1d',
  BANK = '65e6fd68b308214264495c1f'
}

export enum OrderPaymentHistoryTypes {
  DEBT = 1,
  PAYMENT = 2,
  ROLLBACK = 3
}

export const OrderPaymentHistoryTypesStr = {
  1: 'Заказ',
  2: 'Оплаты от контрагентов',
  3: 'Возврат по заказу'
}