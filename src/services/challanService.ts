import { SalesChallan, ChallanStatus } from '../types';
import { inventoryService } from './inventoryService';

const MOCK_CHALLANS: SalesChallan[] = [
  {
    id: 'ch-1',
    challanNumber: 'CH-409',
    customerId: 'cust-1',
    customerName: 'Jane Bradley',
    items: [
      {
        productId: 'prod-1',
        productName: 'Industrial Controller IC-50',
        quantity: 12,
        price: 450.00,
        subtotal: 5400.00,
      },
      {
        productId: 'prod-2',
        productName: 'Heavy Duty Servo Motor',
        quantity: 2,
        price: 850.00,
        subtotal: 1700.00,
      }
    ],
    grandTotal: 7100.00,
    grandQuantity: 14,
    createdDate: '2026-07-22',
    status: 'Confirmed',
  },
  {
    id: 'ch-2',
    challanNumber: 'CH-410',
    customerId: 'cust-2',
    customerName: 'David Miller',
    items: [
      {
        productId: 'prod-3',
        productName: 'Velora Connect Sensor Grid',
        quantity: 8,
        price: 125.00,
        subtotal: 1000.00,
      }
    ],
    grandTotal: 1000.00,
    grandQuantity: 8,
    createdDate: '2026-07-22',
    status: 'Draft',
  },
  {
    id: 'ch-3',
    challanNumber: 'CH-411',
    customerId: 'cust-3',
    customerName: 'Robert Chen',
    items: [
      {
        productId: 'prod-1',
        productName: 'Industrial Controller IC-50',
        quantity: 22,
        price: 450.00,
        subtotal: 9900.00,
      }
    ],
    grandTotal: 9900.00,
    grandQuantity: 22,
    createdDate: '2026-07-21',
    status: 'Confirmed',
  },
  {
    id: 'ch-4',
    challanNumber: 'CH-412',
    customerId: 'cust-4',
    customerName: 'Emily Watson',
    items: [
      {
        productId: 'prod-4',
        productName: 'Reinforced Aluminum Brackets',
        quantity: 100,
        price: 12.50,
        subtotal: 1250.00,
      }
    ],
    grandTotal: 1250.00,
    grandQuantity: 100,
    createdDate: '2026-07-20',
    status: 'Cancelled',
  }
];

const STORAGE_KEY = 'velora_challans';

const getStoredChallans = (): SalesChallan[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_CHALLANS));
    return MOCK_CHALLANS;
  }
  return JSON.parse(data);
};

export const challanService = {
  async getChallans(): Promise<SalesChallan[]> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return getStoredChallans();
  },

  async getChallanById(id: string): Promise<SalesChallan | null> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const list = getStoredChallans();
    return list.find((c) => c.id === id) || null;
  },

  async createChallan(challan: Omit<SalesChallan, 'id' | 'challanNumber' | 'createdDate'>, createdBy: string): Promise<SalesChallan> {
    await new Promise((resolve) => setTimeout(resolve, 600));
    const list = getStoredChallans();
    
    // Generate next Challan Number
    const nextNum = 409 + list.length;
    const newChallan: SalesChallan = {
      ...challan,
      id: `ch-${Date.now()}`,
      challanNumber: `CH-${nextNum}`,
      createdDate: new Date().toISOString().split('T')[0],
    };

    // If confirmed on creation, trigger inventory deduct
    if (newChallan.status === 'Confirmed') {
      for (const item of newChallan.items) {
        await inventoryService.addMovement(
          item.productId,
          'OUT',
          item.quantity,
          `Stock dispatched for Challan ${newChallan.challanNumber}`,
          createdBy
        );
      }
    }

    list.unshift(newChallan);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    return newChallan;
  },

  async updateChallanStatus(id: string, newStatus: ChallanStatus, updatedBy: string): Promise<SalesChallan> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const list = getStoredChallans();
    const index = list.findIndex((c) => c.id === id);
    if (index === -1) throw new Error('Challan not found');
    
    const current = list[index];
    const prevStatus = current.status;
    
    // Adjust stock if changing from Draft/Cancelled -> Confirmed
    if (newStatus === 'Confirmed' && prevStatus !== 'Confirmed') {
      for (const item of current.items) {
        await inventoryService.addMovement(
          item.productId,
          'OUT',
          item.quantity,
          `Stock dispatched for Challan ${current.challanNumber}`,
          updatedBy
        );
      }
    } 
    // Return stock if Confirmed -> Cancelled
    else if (newStatus === 'Cancelled' && prevStatus === 'Confirmed') {
      for (const item of current.items) {
        await inventoryService.addMovement(
          item.productId,
          'IN',
          item.quantity,
          `Returned stock for Cancelled Challan ${current.challanNumber}`,
          updatedBy
        );
      }
    }

    current.status = newStatus;
    list[index] = current;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    return current;
  }
};
