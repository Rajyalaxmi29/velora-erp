import { UserRole } from '../context/AuthContext';
import { TabId } from './dashboardTypes';

export interface NavPermission {
  id: TabId;
  label: string;
  allowed: UserRole[];
}

export const NAV_PERMISSIONS: NavPermission[] = [
  { id: 'dashboard',  label: 'Dashboard',      allowed: ['Admin', 'Sales', 'Warehouse', 'Accounts'] },
  { id: 'customers',  label: 'Customers',       allowed: ['Admin', 'Sales'] },
  { id: 'products',   label: 'Products',        allowed: ['Admin', 'Warehouse'] },
  { id: 'inventory',  label: 'Inventory',       allowed: ['Admin', 'Warehouse'] },
  { id: 'challans',   label: 'Sales Challans',  allowed: ['Admin', 'Sales', 'Accounts'] },
  { id: 'reports',    label: 'Reports',         allowed: ['Admin', 'Sales', 'Warehouse', 'Accounts'] },
  { id: 'settings',   label: 'Settings',        allowed: ['Admin', 'Accounts'] },
];

export const canAccess = (role: UserRole, tab: TabId): boolean => {
  const perm = NAV_PERMISSIONS.find((p) => p.id === tab);
  return perm ? perm.allowed.includes(role) : false;
};
