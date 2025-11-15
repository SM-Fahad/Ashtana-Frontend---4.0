export interface MyBagItem {
  id: number;
  productId: number;
  productName: string;
  pricePerItem: number;
  quantity: number;
  totalPrice: number;
  productImageUrls?: string[];
  primaryImageUrl?: string; // This will be populated now
}

export interface MyBag {
  id: number;
  userName: string;
  totalItems: number;
  totalPrice: number;
  items: MyBagItem[];
}

export interface AddToBagRequest {
  userName: string;
  productId: number;
  quantity: number;
}