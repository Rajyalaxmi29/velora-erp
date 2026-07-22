export type CustomerType = 'Retail' | 'Wholesale' | 'Distributor';
export type CustomerStatus = 'Lead' | 'Active' | 'Inactive';

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  businessName: string;
  gstNumber?: string;
  customerType: CustomerType;
  status: CustomerStatus;
  followUpDate: string;
  notes?: string;
}

export type ProductStatus = 'Active' | 'Draft' | 'Inactive';

export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  unitPrice: number;
  currentStock: number;
  minStock: number;
  warehouse: string;
  image?: string;
  status: ProductStatus;
}

export type MovementType = 'IN' | 'OUT';

export interface StockMovement {
  id: string;
  productId: string;
  productName: string;
  type: MovementType;
  quantity: number;
  reason: string;
  createdBy: string;
  timestamp: string;
}

export interface SalesChallanItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  subtotal: number;
}

export type ChallanStatus = 'Draft' | 'Confirmed' | 'Cancelled';

export interface SalesChallan {
  id: string;
  challanNumber: string;
  customerId: string;
  customerName: string;
  items: SalesChallanItem[];
  grandTotal: number;
  grandQuantity: number;
  createdDate: string;
  status: ChallanStatus;
}

export type ActivityType = 'customer' | 'product' | 'inventory' | 'challan' | 'auth';

export interface ActivityLog {
  id: string;
  description: string;
  user: string;
  timestamp: string;
  type: ActivityType;
}
