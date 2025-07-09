export interface IProduct {
  _id: string;
  productName: string;
  stockOnHand: number;
}

export interface ApiError {
  message: string;
  status?: number;
}