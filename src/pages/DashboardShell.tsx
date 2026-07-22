import React, { useState, useEffect } from 'react';
import { useAuth, UserRole } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  Home, Users, Package, Boxes, FileText, BarChart3,
  Settings as SettingsIcon, LogOut, Sun, Moon, Bell, ChevronRight, Menu, X,
  ShieldAlert
} from 'lucide-react';
import DashboardOverview from './DashboardOverview';
import CustomerCRM from './CustomerCRM';
import ProductManagement from './ProductManagement';
import InventoryManagement from './InventoryManagement';
import SalesChallans from './SalesChallans';
import Reports from './Reports';
import Settings from './Settings';

type TabId = 'dashboard' | 'customers' | 'products' | 'inventory' | 'challans' | 'reports' | 'settings';

// ─── NAV ITEMS (visual config only) ──────────────────────────────────
const ALL_NAV_ITEMS: { id: TabId; label: string; icon: React.ReactNode; badge?: string }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: <Home className="w-4 h-4" /> },
  { id: 'customers', label: 'Customers', icon: <Users className="w-4 h-4" /> },
  { id: 'products', label: 'Products', icon: <Package className="w-4 h-4" /> },
  { id: 'inventory', label: 'Inventory', icon: <Boxes className="w-4 h-4" />, badge: '!' },
  { id: 'challans', label: 'Sales Challans', icon: <FileText className="w-4 h-4" /> },
  { id: 'reports', label: 'Reports', icon: <BarChart3 className="w-4 h-4" /> },
  { id: 'settings', label: 'Settings', icon: <SettingsIcon className="w-4 h-4" /> },
];

// ─── ROLE → ALLOWED TABS ─────────────────────────────────────────────
const ROLE_TABS: Record<UserRole, TabId[]> = {
  Admin:     ['dashboard', 'customers', 'products', 'inventory', 'challans', 'reports', 'settings'],
  Sales:     ['dashboard', 'customers', 'challans', 'reports'],
  Warehouse: ['dashboard', 'products', 'inventory', 'reports'],
  Accounts:  ['dashboard', 'challans', 'reports', 'settings'],
};

const ROLE_COLORS: Record<UserRole, string> = {
  Admin: 'bg-[#E3FAFC] text-[#0C8599] dark:bg-[#1A3C40] dark:text-[#66D9E8]',
  Sales: 'bg-[#E8F9FF] text-[#1C7ED6] dark:bg-[#142D4C] dark:text-[#74C0FC]',
  Warehouse: 'bg-[#FFEFE6] text-[#FF6B00] dark:bg-[#382010] dark:text-[#FF9248]',
  Accounts: 'bg-[#E6FCF5] text-[#099268] dark:bg-[#103024] dark:text-[#63E6BE]',
};

export default function DashboardShell() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabId>('dashboard');
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const role: UserRole = (user?.role as UserRole) || 'Admin';
  const allowedTabs = ROLE_TABS[role];

  // Filter sidebar items based on role
  const visibleNav = ALL_NAV_ITEMS.filter((item) => allowedTabs.includes(item.id));

  useEffect(() => {
    const saved = localStorage.getItem('velora_theme');
    if (saved === 'dark') { setDarkMode(true); document.documentElement.classList.add('dark'); }
  }, []);

  const toggleDark = () => {
    const next = !darkMode;
    setDarkMode(next);
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('velora_theme', next ? 'dark' : 'light');
  };

  const handleLogout = () => { logout(); navigate('/'); };

  const handleTabChange = (id: TabId) => {
    setActiveTab(id);
    setSidebarOpen(false);
  };

  const canAccess = allowedTabs.includes(activeTab);

  const renderContent = () => {
    // If the active tab is not allowed for this role, show Access Denied
    if (!canAccess) {
      return <AccessDenied role={role} onBack={() => setActiveTab('dashboard')} />;
    }

    switch (activeTab) {
      case 'dashboard': return <DashboardOverview />;
      case 'customers': return <CustomerCRM />;
      case 'products': return <ProductManagement />;
      case 'inventory': return <InventoryManagement />;
      case 'challans': return <SalesChallans />;
      case 'reports': return <Reports />;
      case 'settings': return <Settings />;
      default: return <ComingSoon tab={activeTab} onBack={() => setActiveTab('dashboard')} />;
    }
  };

  const userInitials = user?.name.split(' ').map(n => n[0]).join('') || '?';

  return (
    <div className="min-h-screen bg-[#F8F9FA] dark:bg-[#0F1113] text-foreground dark:text-[#E2E8F0] flex font-body transition-colors duration-200">

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50 lg:z-auto
        w-64 bg-white dark:bg-[#15181C] border-r border-border dark:border-zinc-800
        flex flex-col justify-between select-none
        transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Brand */}
        <div>
          <div className="h-16 flex items-center justify-between px-5 border-b border-border dark:border-zinc-800">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold">✦</span>
              <span className="font-bold tracking-tight text-sm">Velora Suite</span>
              <span className="text-[8px] bg-secondary dark:bg-zinc-800 px-1.5 py-0.5 rounded font-mono">v2.0</span>
            </div>
            <button
              className="lg:hidden text-muted-foreground hover:text-foreground"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Nav — only items allowed for this role */}
          <nav className="p-3 space-y-0.5">
            {visibleNav.map((item) => (
              <button
                key={item.id}
                onClick={() => handleTabChange(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                  activeTab === item.id
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:bg-secondary dark:hover:bg-zinc-800 hover:text-foreground'
                }`}
              >
                <div className="flex items-center gap-3">
                  {item.icon}
                  <span>{item.label}</span>
                </div>
                {item.badge && activeTab !== item.id && (
                  <span className="bg-[#FFEFE6] dark:bg-[#382010] text-[#FF6B00] px-1.5 py-0.5 rounded-full font-bold text-[8px]">
                    {item.badge}
                  </span>
                )}
                {!item.badge && activeTab !== item.id && (
                  <ChevronRight className="w-3 h-3 opacity-40" />
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* User footer */}
        <div className="p-4 border-t border-border dark:border-zinc-800 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-secondary dark:bg-zinc-800 border border-border dark:border-zinc-700 flex items-center justify-center font-bold text-xs text-foreground flex-shrink-0">
              {userInitials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-bold text-foreground truncate">{user?.name}</p>
              <p className="text-[9px] text-muted-foreground truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-1.5 border border-border dark:border-zinc-800 hover:bg-[#FFF5F5] dark:hover:bg-[#201010] hover:text-[#E03131] rounded-lg text-[10px] font-medium transition-all text-muted-foreground"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Top header */}
        <header className="h-16 bg-white dark:bg-[#15181C] border-b border-border dark:border-zinc-800 flex items-center justify-between px-4 md:px-8 flex-shrink-0">
          <div className="flex items-center gap-3">
            {/* Mobile hamburger */}
            <button
              className="lg:hidden text-muted-foreground hover:text-foreground p-2 rounded-lg hover:bg-secondary dark:hover:bg-zinc-800"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-4 h-4" />
            </button>
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
              <span>Velora</span>
              <ChevronRight className="w-3 h-3" />
              <span className="font-bold text-foreground capitalize">{activeTab}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Role badge */}
            <span className={`hidden sm:inline-flex text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${ROLE_COLORS[role]}`}>
              {role} Access
            </span>

            {/* Dark mode toggle */}
            <button
              onClick={toggleDark}
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-secondary dark:hover:bg-zinc-800 border border-border/40 dark:border-zinc-800 text-muted-foreground hover:text-foreground"
            >
              {darkMode ? <Sun className="w-4 h-4 text-[#F59F00]" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Notifications */}
            <button className="relative w-8 h-8 flex items-center justify-center rounded-lg hover:bg-secondary dark:hover:bg-zinc-800 border border-border/40 dark:border-zinc-800 text-muted-foreground hover:text-foreground">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-[#FF6B00] rounded-full"></span>
            </button>

            {/* Avatar */}
            <div className="w-8 h-8 rounded-full bg-secondary dark:bg-zinc-800 border border-border dark:border-zinc-700 flex items-center justify-center font-bold text-[10px] text-foreground flex-shrink-0">
              {userInitials}
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto bg-secondary/20 dark:bg-[#0F1113]">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

// ─── 403 ACCESS DENIED ───────────────────────────────────────────────
function AccessDenied({ role, onBack }: { role: string; onBack: () => void }) {
  return (
    <div className="h-full flex flex-col items-center justify-center text-center select-none py-20">
      <div className="w-20 h-20 rounded-full bg-[#FFF5F5] dark:bg-[#201515] flex items-center justify-center mb-6">
        <ShieldAlert className="w-9 h-9 text-[#E03131]" />
      </div>
      <div className="text-[11px] font-black tracking-widest uppercase text-[#E03131] mb-2">403</div>
      <h2 className="text-xl font-bold tracking-tight text-foreground dark:text-white">Access Denied</h2>
      <p className="text-xs text-muted-foreground max-w-sm mt-2 leading-relaxed">
        Your <span className="font-bold">{role}</span> role does not have permission to access this module.
        Please contact your administrator if you need access.
      </p>
      <button
        onClick={onBack}
        className="mt-6 bg-primary text-primary-foreground px-5 py-2 rounded-lg text-xs font-semibold hover:opacity-95 transition-opacity"
      >
        ← Back to Dashboard
      </button>
    </div>
  );
}

// ─── COMING SOON ─────────────────────────────────────────────────────
function ComingSoon({ tab, onBack }: { tab: string; onBack: () => void }) {
  return (
    <div className="h-full flex flex-col items-center justify-center text-center select-none py-20">
      <div className="w-16 h-16 rounded-full bg-secondary dark:bg-zinc-800 flex items-center justify-center mb-6 text-muted-foreground">
        <BarChart3 className="w-7 h-7" />
      </div>
      <h2 className="text-xl font-bold tracking-tight text-foreground capitalize">{tab} Module</h2>
      <p className="text-xs text-muted-foreground max-w-sm mt-2 leading-relaxed">
        This workspace is scheduled for the next development sprint. It will connect to the live backend when available.
      </p>
      <button
        onClick={onBack}
        className="mt-6 bg-primary text-primary-foreground px-5 py-2 rounded-lg text-xs font-semibold hover:opacity-95 transition-opacity"
      >
        ← Back to Dashboard
      </button>
    </div>
  );
}
