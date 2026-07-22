import { Customer } from '../types';

const MOCK_CUSTOMERS: Customer[] = [
  {
    id: 'cust-1',
    name: 'Jane Bradley',
    businessName: 'Bradley Retail Group',
    phone: '555-0199',
    email: 'jane@bradleygroup.com',
    gstNumber: '27AAAAA1111A1Z1',
    customerType: 'Retail',
    status: 'Active',
    followUpDate: '2026-07-25',
    notes: 'Key contact for Western region retail expansion. Prefers bulk dispatches.',
  },
  {
    id: 'cust-2',
    name: 'David Miller',
    businessName: 'Miller Wholesale Supplies',
    phone: '555-0143',
    email: 'david@millerwholesale.com',
    gstNumber: '27BBBBB2222B2Z2',
    customerType: 'Wholesale',
    status: 'Active',
    followUpDate: '2026-07-23',
    notes: 'Handles volume electronics dispatches. Inquiring about GPT-5 support logs.',
  },
  {
    id: 'cust-3',
    name: 'Robert Chen',
    businessName: 'Chen Distributors Ltd',
    phone: '555-0176',
    email: 'robert@chendist.com',
    gstNumber: '27CCCCC3333C3Z3',
    customerType: 'Distributor',
    status: 'Active',
    followUpDate: '2026-07-28',
    notes: 'Schedules orders on the 1st of every month. Highly reliable partner.',
  },
  {
    id: 'cust-4',
    name: 'Emily Watson',
    businessName: 'Watson General Stores',
    phone: '555-0121',
    email: 'emily@watsonstores.com',
    gstNumber: '27DDDDD4444D4Z4',
    customerType: 'Retail',
    status: 'Lead',
    followUpDate: '2026-07-24',
    notes: 'Met at Shanghai Logistics expo. Showed interest in automated packing services.',
  },
  {
    id: 'cust-5',
    name: 'Michael Chang',
    businessName: 'Chang B2B Sourcing',
    phone: '555-0105',
    email: 'michael@changsourcing.com',
    gstNumber: '',
    customerType: 'Wholesale',
    status: 'Inactive',
    followUpDate: '2026-08-12',
    notes: 'Account on hold due to regional restructuring.',
  }
];

const STORAGE_KEY = 'velora_customers';

const getStoredCustomers = (): Customer[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_CUSTOMERS));
    return MOCK_CUSTOMERS;
  }
  return JSON.parse(data);
};

export const customerService = {
  async getCustomers(): Promise<Customer[]> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return getStoredCustomers();
  },

  async getCustomerById(id: string): Promise<Customer | null> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const list = getStoredCustomers();
    return list.find((c) => c.id === id) || null;
  },

  async createCustomer(customer: Omit<Customer, 'id'>): Promise<Customer> {
    await new Promise((resolve) => setTimeout(resolve, 600));
    const list = getStoredCustomers();
    const newCustomer: Customer = {
      ...customer,
      id: `cust-${Date.now()}`,
    };
    list.unshift(newCustomer);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    return newCustomer;
  },

  async updateCustomer(id: string, customer: Partial<Customer>): Promise<Customer> {
    await new Promise((resolve) => setTimeout(resolve, 600));
    const list = getStoredCustomers();
    const index = list.findIndex((c) => c.id === id);
    if (index === -1) throw new Error('Customer not found');
    const updated: Customer = {
      ...list[index],
      ...customer,
    };
    list[index] = updated;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    return updated;
  },

  async deleteCustomer(id: string): Promise<boolean> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const list = getStoredCustomers();
    const filtered = list.filter((c) => c.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return true;
  },
};
