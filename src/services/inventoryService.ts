import { StockMovement } from '../types';
import { productService } from './productService';

const MOCK_MOVEMENTS: StockMovement[] = [
  {
    id: 'move-1',
    productId: 'prod-1',
    productName: 'Industrial Controller IC-50',
    type: 'IN',
    quantity: 50,
    reason: 'Restocked from manufacturer',
    createdBy: 'Marcus Vance (Warehouse)',
    timestamp: '2026-07-22T14:30:00Z',
  },
  {
    id: 'move-2',
    productId: 'prod-2',
    productName: 'Heavy Duty Servo Motor',
    type: 'OUT',
    quantity: 10,
    reason: 'Dispatch for Challan #CH-409',
    createdBy: 'Alex Harrison (Admin)',
    timestamp: '2026-07-22T13:45:00Z',
  },
  {
    id: 'move-3',
    productId: 'prod-4',
    productName: 'Reinforced Aluminum Brackets',
    type: 'OUT',
    quantity: 120,
    reason: 'Bulk wholesale dispatch',
    createdBy: 'Sarah Jenkins (Sales)',
    timestamp: '2026-07-21T09:15:00Z',
  },
  {
    id: 'move-4',
    productId: 'prod-5',
    productName: 'Precision Calibration Dial',
    type: 'OUT',
    quantity: 15,
    reason: 'Damaged in transit - write off',
    createdBy: 'Marcus Vance (Warehouse)',
    timestamp: '2026-07-20T16:20:00Z',
  }
];

const STORAGE_KEY = 'velora_movements';

const getStoredMovements = (): StockMovement[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_MOVEMENTS));
    return MOCK_MOVEMENTS;
  }
  return JSON.parse(data);
};

export const inventoryService = {
  async getMovements(): Promise<StockMovement[]> {
    await new Promise((resolve) => setTimeout(resolve, 400));
    return getStoredMovements();
  },

  async addMovement(
    productId: string, 
    type: 'IN' | 'OUT', 
    quantity: number, 
    reason: string, 
    createdBy: string
  ): Promise<StockMovement> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    // Fetch product to adjust stock and get product name
    const product = await productService.getProductById(productId);
    if (!product) throw new Error('Product not found');

    const change = type === 'IN' ? quantity : -quantity;
    const newStock = Math.max(0, product.currentStock + change);
    
    // Update product stock in product service
    await productService.updateProduct(productId, { currentStock: newStock });

    const list = getStoredMovements();
    const newMovement: StockMovement = {
      id: `move-${Date.now()}`,
      productId,
      productName: product.name,
      type,
      quantity,
      reason,
      createdBy,
      timestamp: new Date().toISOString(),
    };
    list.unshift(newMovement);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    return newMovement;
  },

  async getInventoryStats() {
    const products = await productService.getProducts();
    const totalProducts = products.length;
    let availableStock = 0;
    let lowStock = 0;
    let outOfStock = 0;

    products.forEach((p) => {
      availableStock += p.currentStock;
      if (p.currentStock === 0) {
        outOfStock++;
      } else if (p.currentStock < p.minStock) {
        lowStock++;
      }
    });

    return {
      totalProducts,
      availableStock,
      lowStock,
      outOfStock,
    };
  }
};
