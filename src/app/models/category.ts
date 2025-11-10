

export interface Category {
  id?: number;
  name: string;
  description?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface SubCategory {
  id?: number;
  name: string;
  description?: string;
  categoryId: number;
  isActive?: boolean;
}