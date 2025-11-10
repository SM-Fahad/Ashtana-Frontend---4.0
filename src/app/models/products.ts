

// product-request.dto.ts
export interface ProductRequestDTO {
  name: string;
  description?: string;
  price: number;
  stock: number;
  sku?: string;
  categoryId: number;
  subCategoryId?: number;
  userId?: number;
  status?: 'ACTIVE' | 'INACTIVE' | 'PENDING';
  
  // Many-to-Many relationships
  sizeIds?: number[];
  colorIds?: number[];
  
  // Additional fields
  weight?: number;
  dimensions?: string;
  material?: string;
  brand?: string;
  isFeatured?: boolean;
  isBestSeller?: boolean;
}

// product-response.dto.ts
export interface ProductResponseDTO {
  id?: number;
  name: string;
  description?: string;
  price: number;
  stock: number;
  imageUrls?: string[];
  status: 'ACTIVE' | 'INACTIVE' | 'PENDING';
  categoryName?: string;
  subCategoryName?: string;
  colorName?: string;
  sizeName?: string;
  
  // Many-to-Many relationships
  availableSizes?: { [key: string]: string };
  availableColors?: { [key: string]: string };
  
  // Additional fields
  sku?: string;
  weight?: number;
  dimensions?: string;
  material?: string;
  brand?: string;
  isFeatured?: boolean;
  isBestSeller?: boolean;
  createdAt?: string;
  updatedAt?: string;

  // For form handling
  categoryId?: number;
  subCategoryId?: number;
}

// Extended interface for detailed image information
export interface ProductImageDetail {
  id: number;
  url: string;
  altText?: string;
  isPrimary: boolean;
  sortOrder: number;
}

export interface ProductResponseWithImagesDTO extends ProductResponseDTO {
  imageDetails?: ProductImageDetail[];
}