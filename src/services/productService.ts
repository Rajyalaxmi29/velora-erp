import { Product } from '../types';

const MOCK_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'Industrial Controller IC-50',
    sku: 'IC-50-CTRL',
    category: 'Electronics',
    unitPrice: 450.00,
    currentStock: 120,
    minStock: 20,
    warehouse: 'Alpha Warehouse (Rack A1)',
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=200',
    status: 'Active',
  },
  {
    id: 'prod-2',
    name: 'Heavy Duty Servo Motor',
    sku: 'SV-MOTOR-HD',
    category: 'Machinery',
    unitPrice: 850.00,
    currentStock: 15,
    minStock: 25, // Stock < minStock -> Low Stock!
    warehouse: 'Alpha Warehouse (Rack B3)',
    image: 'https://images.unsplash.com/photo-1537462715879-360eeb61a0bc?auto=format&fit=crop&q=80&w=200',
    status: 'Active',
  },
  {
    id: 'prod-3',
    name: 'Velora Connect Sensor Grid',
    sku: 'VC-SENS-GRID',
    category: 'Electronics',
    unitPrice: 125.00,
    currentStock: 480,
    minStock: 50,
    warehouse: 'Beta Storage (Rack C4)',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=200',
    status: 'Active',
  },
  {
    id: 'prod-4',
    name: 'Reinforced Aluminum Brackets',
    sku: 'AL-BRKT-REINF',
    category: 'Hardware',
    unitPrice: 12.50,
    currentStock: 4,
    minStock: 100, // Stock < minStock -> Low Stock!
    warehouse: 'Gamma Warehouse (Shelf D2)',
    image: 'https://images.unsplash.com/photo-1530982009880-aacb15bde800?auto=format&fit=crop&q=80&w=200',
    status: 'Active',
  },
  {
    id: 'prod-5',
    name: 'Precision Calibration Dial',
    sku: 'CAL-DIAL-PRC',
    category: 'Hardware',
    unitPrice: 85.00,
    currentStock: 0, // Out of Stock!
    minStock: 10,
    warehouse: 'Alpha Warehouse (Rack A2)',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=200',
    status: 'Active',
  },
  {
    id: 'prod-6',
    name: 'Optic Fiber Terminal Hub',
    sku: 'OF-HUB-TERM',
    category: 'Electronics',
    unitPrice: 320.00,
    currentStock: 45,
    minStock: 15,
    warehouse: 'Beta Storage (Rack C2)',
    image: 'https://images.unsplash.com/photo-1601524909162-be87252be298?auto=format&fit=crop&q=80&w=200',
    status: 'Draft',
  }
];

const STORAGE_KEY = 'velora_products';

const getStoredProducts = (): Product[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_PRODUCTS));
    return MOCK_PRODUCTS;
  }
  return JSON.parse(data);
};

export const productService = {
  async getProducts(): Promise<Product[]> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return getStoredProducts();
  },

  async getProductById(id: string): Promise<Product | null> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const list = getStoredProducts();
    return list.find((p) => p.id === id) || null;
  },

  async createProduct(product: Omit<Product, 'id'>): Promise<Product> {
    await new Promise((resolve) => setTimeout(resolve, 600));
    const list = getStoredProducts();
    const newProduct: Product = {
      ...product,
      id: `prod-${Date.now()}`,
    };
    list.unshift(newProduct);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    return newProduct;
  },

  async updateProduct(id: string, product: Partial<Product>): Promise<Product> {
    await new Promise((resolve) => setTimeout(resolve, 600));
    const list = getStoredProducts();
    const index = list.findIndex((p) => p.id === id);
    if (index === -1) throw new Error('Product not found');
    const updated: Product = {
      ...list[index],
      ...product,
    };
    list[index] = updated;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    return updated;
  },

  async deleteProduct(id: string): Promise<boolean> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const list = getStoredProducts();
    const filtered = list.filter((p) => p.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return true;
  },
};
