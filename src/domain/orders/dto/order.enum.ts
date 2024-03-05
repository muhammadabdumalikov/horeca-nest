export enum OrderStatus {
  REGISTERED = '1',
  DELIVERY_PROCESS = '2',
  DELIVERED = '3',
  REJECTED = '4',
  PARTIALLY_PAID = '5',
  FULLY_PAID = '6'
}

//                           DELIVERY_PROCESS
//                           FULLY_PAID
// REGISTERED -> REJECTED -> PARTIALLY_PAID -> DELIVERED

export enum PaymentType {
  CASH = 1,
  CARD_TRANSFER = 2,
  DEBT = 3,
}