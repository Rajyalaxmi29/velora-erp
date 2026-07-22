import React from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Users, Package, AlertTriangle, Clock, FileText,
  DollarSign, Heart, TrendingUp, ArrowUpRight,
  ArrowDownRight, Boxes, ShoppingCart, BarChart3,
  UserCheck, PhoneCall, Receipt, CheckCircle2,
  CreditCard, Warehouse, RefreshCw, Search
} from 'lucide-react';

// ─── Shared KPI Card ───────────────────────────────────────────────────
interface KPICardProps {
  label: string;
  value: string | number;
  sub: string;
  icon: React.ReactNode;
  accentLeft?: string;
  valueColor?: string;
}

function KPICard({ label, value, sub, icon, accentLeft, valueColor }: KPICardProps) {
  return (
    <div className={`bg-white dark:bg-[#15181C] border border-border dark:border-zinc-800 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow ${accentLeft ? `border-l-2 ${accentLeft}` : ''}`}>
      <div className="flex justify-between items-center">
        <span className="text-[9px] uppercase tracking-wider font-bold text-muted-foreground">{label}</span>
        <span className="text-muted-foreground">{icon}</span>
      </div>
      <div className={`text-2xl font-black tracking-tight mt-2 ${valueColor || 'text-foreground dark:text-white'}`}>
        {value}
      </div>
      <div className="text-[8px] text-muted-foreground mt-1 font-medium">{sub}</div>
    </div>
  );
}

// ─── Shared SVG Area Chart ─────────────────────────────────────────────
interface ChartProps {
  title: string;
  subtitle: string;
  labels: string[];
  path: string;
  fillPath: string;
  points: [number, number][];
}

function AreaChart({ title, subtitle, labels, path, fillPath, points }: ChartProps) {
  return (
    <div className="lg:col-span-2 bg-white dark:bg-[#15181C] border border-border dark:border-zinc-800 rounded-xl p-5 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="font-bold text-sm text-foreground dark:text-white">{title}</h3>
          <p className="text-[10px] text-muted-foreground">{subtitle}</p>
        </div>
        <div className="flex items-center gap-1 text-[9px] font-semibold text-muted-foreground">
          <span className="w-2 h-2 bg-accent rounded-sm inline-block"></span> This Week
        </div>
      </div>
      <div className="h-40 w-full relative">
        <svg className="w-full h-full" viewBox="0 0 500 130" preserveAspectRatio="none">
          <defs>
            <linearGradient id={`chart-grad-${title.replace(/\s/g,'')}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(var(--accent))" stopOpacity="0.18" />
              <stop offset="100%" stopColor="hsl(var(--accent))" stopOpacity="0" />
            </linearGradient>
          </defs>
          <line x1="0" y1="32" x2="500" y2="32" stroke="currentColor" strokeOpacity="0.05" strokeWidth="1" />
          <line x1="0" y1="65" x2="500" y2="65" stroke="currentColor" strokeOpacity="0.05" strokeWidth="1" />
          <line x1="0" y1="97" x2="500" y2="97" stroke="currentColor" strokeOpacity="0.05" strokeWidth="1" />
          <path d={fillPath} fill={`url(#chart-grad-${title.replace(/\s/g,'')})`} />
          <path d={path} fill="none" stroke="hsl(var(--accent))" strokeWidth="2" strokeLinecap="round" />
          {points.map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r="3" fill="hsl(var(--accent))" />
          ))}
        </svg>
      </div>
      <div className="flex justify-between items-center text-[9px] text-muted-foreground px-2 pt-2">
        {labels.map((l) => <span key={l}>{l}</span>)}
      </div>
    </div>
  );
}

// ─── Shared Activity Feed ──────────────────────────────────────────────
interface ActivityItem {
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  meta: string;
  time: string;
}

function ActivityFeed({ items }: { items: ActivityItem[] }) {
  return (
    <div className="bg-white dark:bg-[#15181C] border border-border dark:border-zinc-800 rounded-xl p-5 shadow-sm flex flex-col">
      <h3 className="font-bold text-sm text-foreground dark:text-white mb-4">Recent Activity</h3>
      <div className="space-y-3 flex-1">
        {items.map((a, i) => (
          <div key={i} className="flex items-start gap-3 p-2 rounded-lg hover:bg-secondary/30 dark:hover:bg-zinc-800/30 transition-colors">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${a.iconBg}`}>
              {a.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-semibold text-foreground dark:text-zinc-200 truncate">{a.title}</p>
              <p className="text-[9px] text-muted-foreground">{a.meta}</p>
            </div>
            <span className="text-[8px] font-mono text-muted-foreground/70 flex-shrink-0">{a.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Quick Actions ─────────────────────────────────────────────────────
function QuickActions({ actions }: { actions: string[] }) {
  return (
    <div className="bg-white dark:bg-[#15181C] border border-border dark:border-zinc-800 rounded-xl p-5 shadow-sm">
      <h3 className="font-bold text-sm text-foreground dark:text-white mb-4">Quick Actions</h3>
      <div className="flex flex-wrap gap-2">
        {actions.map((action) => (
          <button
            key={action}
            className="px-3 py-1.5 text-[11px] font-semibold border border-border dark:border-zinc-800 rounded-full bg-secondary/50 dark:bg-zinc-800/50 hover:bg-accent hover:text-white hover:border-accent transition-all text-foreground dark:text-zinc-300"
          >
            {action}
          </button>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// ADMIN DASHBOARD
// ═══════════════════════════════════════════════════════════════════════
function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-foreground dark:text-white">Operational Overview</h1>
        <p className="text-xs text-muted-foreground">Complete business overview across all departments.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <KPICard label="Total Customers" value="1,482" sub="+14 this week" icon={<Users className="w-4 h-4" />} />
        <KPICard label="Total Products" value="840" sub="Across 3 warehouses" icon={<Package className="w-4 h-4" />} />
        <KPICard label="Inventory Health" value="76%" sub="24% below threshold" icon={<Heart className="w-4 h-4" />} valueColor="text-[#099268]" />
        <KPICard label="Pending Challans" value="12" sub="8 in packing" icon={<FileText className="w-4 h-4" />} />
        <KPICard label="Today's Follow-ups" value="8" sub="2 overdue" icon={<Clock className="w-4 h-4" />} accentLeft="border-l-[#FF6B00]" valueColor="text-[#FF6B00]" />
        <KPICard label="Overall Revenue" value="₹142K" sub="This month" icon={<DollarSign className="w-4 h-4" />} valueColor="text-[#099268]" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <AreaChart
          title="Overall Business Performance"
          subtitle="Revenue, orders and customer activity this week."
          labels={['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']}
          path="M 0 110 C 60 90, 90 70, 140 45 C 190 20, 230 60, 280 40 C 330 20, 380 10, 440 30 L 500 15"
          fillPath="M 0 130 C 60 90, 90 70, 140 45 C 190 20, 230 60, 280 40 C 330 20, 380 10, 440 30 L 500 15 L 500 130 L 0 130 Z"
          points={[[0,110],[140,45],[280,40],[440,30],[500,15]]}
        />
        <ActivityFeed items={[
          { icon: <Users className="w-3 h-3"/>, iconBg:'bg-[#E3FAFC] text-[#0C8599]', title:'New customer: Priya Distributors', meta:'Sales — Lead added', time:'5m ago' },
          { icon: <FileText className="w-3 h-3"/>, iconBg:'bg-accent/10 text-accent', title:'Challan CH-415 confirmed', meta:'Admin — Stock dispatched', time:'18m ago' },
          { icon: <AlertTriangle className="w-3 h-3"/>, iconBg:'bg-[#FFF9DB] text-[#F59F00]', title:'Low stock: Servo Motor HD', meta:'Warehouse — Reorder needed', time:'42m ago' },
          { icon: <DollarSign className="w-3 h-3"/>, iconBg:'bg-[#E6FCF5] text-[#099268]', title:'Invoice INV-208 paid', meta:'Accounts — ₹18,500 received', time:'1h ago' },
          { icon: <Package className="w-3 h-3"/>, iconBg:'bg-secondary dark:bg-zinc-800 text-muted-foreground', title:'Product IC-52 added to catalog', meta:'Admin — Electronics', time:'2h ago' },
          { icon: <PhoneCall className="w-3 h-3"/>, iconBg:'bg-[#F4F2FF] text-[#5C2AF5]', title:'Follow-up: Miller Wholesale', meta:'Sales — Call scheduled', time:'3h ago' },
        ]} />
      </div>

      <QuickActions actions={['Add Customer', 'Add Product', 'Create Challan', 'Manage Inventory', 'View Reports', 'System Settings']} />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// SALES DASHBOARD
// ═══════════════════════════════════════════════════════════════════════
function SalesDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-foreground dark:text-white">Sales Operations</h1>
        <p className="text-xs text-muted-foreground">Manage customers, leads and sales activities.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <KPICard label="Today's Leads" value="6" sub="3 hot, 3 warm" icon={<TrendingUp className="w-4 h-4" />} valueColor="text-accent" />
        <KPICard label="Active Customers" value="1,148" sub="334 inactive" icon={<UserCheck className="w-4 h-4" />} />
        <KPICard label="Today's Follow-ups" value="8" sub="2 overdue" icon={<Clock className="w-4 h-4" />} accentLeft="border-l-[#FF6B00]" valueColor="text-[#FF6B00]" />
        <KPICard label="Pending Challans" value="5" sub="Awaiting dispatch" icon={<FileText className="w-4 h-4" />} />
        <KPICard label="Monthly Sales" value="₹94K" sub="+12% vs last month" icon={<ShoppingCart className="w-4 h-4" />} valueColor="text-[#099268]" />
        <KPICard label="Conversion Rate" value="68%" sub="From leads this month" icon={<BarChart3 className="w-4 h-4" />} valueColor="text-[#099268]" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <AreaChart
          title="Monthly Sales Performance"
          subtitle="Units sold and revenue generated this week."
          labels={['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']}
          path="M 0 120 C 60 100, 100 80, 150 55 C 200 30, 250 70, 300 50 C 350 28, 400 40, 500 18"
          fillPath="M 0 130 C 60 100, 100 80, 150 55 C 200 30, 250 70, 300 50 C 350 28, 400 40, 500 18 L 500 130 L 0 130 Z"
          points={[[0,120],[150,55],[300,50],[500,18]]}
        />
        <ActivityFeed items={[
          { icon: <Users className="w-3 h-3"/>, iconBg:'bg-[#E3FAFC] text-[#0C8599]', title:'New lead: Apex Wholesale Co.', meta:'Wholesale — Added by you', time:'12m ago' },
          { icon: <PhoneCall className="w-3 h-3"/>, iconBg:'bg-[#F4F2FF] text-[#5C2AF5]', title:'Follow-up completed: Chen Ltd.', meta:'Distributor — Interested in bulk', time:'35m ago' },
          { icon: <FileText className="w-3 h-3"/>, iconBg:'bg-accent/10 text-accent', title:'Draft challan CH-416 saved', meta:'3 products — ₹14,200', time:'1h ago' },
          { icon: <UserCheck className="w-3 h-3"/>, iconBg:'bg-[#E6FCF5] text-[#099268]', title:'Lead converted: Watson Stores', meta:'Status changed to Active', time:'2h ago' },
          { icon: <PhoneCall className="w-3 h-3"/>, iconBg:'bg-[#FFF9DB] text-[#F59F00]', title:'Follow-up due: Emily Watson', meta:'Scheduled for today', time:'3h ago' },
          { icon: <ShoppingCart className="w-3 h-3"/>, iconBg:'bg-secondary dark:bg-zinc-800 text-muted-foreground', title:'Challan CH-414 dispatched', meta:'Acme Corp — ₹7,100', time:'4h ago' },
        ]} />
      </div>

      <QuickActions actions={['Add Customer', 'Create Challan', 'Add Follow-up', 'Search Customer', 'View My Challans', 'Monthly Report']} />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// WAREHOUSE DASHBOARD
// ═══════════════════════════════════════════════════════════════════════
function WarehouseDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-foreground dark:text-white">Inventory Operations</h1>
        <p className="text-xs text-muted-foreground">Monitor warehouse stock and inventory movement.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <KPICard label="Total Products" value="840" sub="6 categories" icon={<Package className="w-4 h-4" />} />
        <KPICard label="Available Stock" value="64,820" sub="Units across racks" icon={<Boxes className="w-4 h-4" />} valueColor="text-[#099268]" />
        <KPICard label="Low Stock Items" value="14" sub="Below reorder limit" icon={<AlertTriangle className="w-4 h-4" />} accentLeft="border-l-[#FF6B00]" valueColor="text-[#FF6B00]" />
        <KPICard label="Out of Stock" value="3" sub="Needs urgent restock" icon={<Package className="w-4 h-4" />} accentLeft="border-l-[#E03131]" valueColor="text-[#E03131]" />
        <KPICard label="Stock In Today" value="320" sub="Units received" icon={<ArrowUpRight className="w-4 h-4" />} valueColor="text-[#099268]" />
        <KPICard label="Stock Out Today" value="185" sub="Units dispatched" icon={<ArrowDownRight className="w-4 h-4" />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <AreaChart
          title="Inventory Movement"
          subtitle="Stock IN vs OUT transactions this week."
          labels={['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']}
          path="M 0 90 C 50 110, 90 70, 140 40 C 190 10, 230 80, 280 55 C 330 30, 390 15, 500 35"
          fillPath="M 0 130 C 50 110, 90 70, 140 40 C 190 10, 230 80, 280 55 C 330 30, 390 15, 500 35 L 500 130 L 0 130 Z"
          points={[[0,90],[140,40],[280,55],[500,35]]}
        />
        <ActivityFeed items={[
          { icon: <ArrowUpRight className="w-3 h-3"/>, iconBg:'bg-[#E6FCF5] text-[#099268]', title:'IN: IC-50 Controller × 50 units', meta:'Alpha Warehouse Rack A1', time:'8m ago' },
          { icon: <ArrowDownRight className="w-3 h-3"/>, iconBg:'bg-[#FFF5F5] text-[#E03131]', title:'OUT: Servo Motor × 10 units', meta:'Dispatched for CH-409', time:'25m ago' },
          { icon: <AlertTriangle className="w-3 h-3"/>, iconBg:'bg-[#FFF9DB] text-[#F59F00]', title:'Alert: Aluminum Brackets low', meta:'Only 4 units — min 100', time:'1h ago' },
          { icon: <Warehouse className="w-3 h-3"/>, iconBg:'bg-secondary dark:bg-zinc-800 text-muted-foreground', title:'Gamma Warehouse audit done', meta:'All racks counted and verified', time:'2h ago' },
          { icon: <ArrowUpRight className="w-3 h-3"/>, iconBg:'bg-[#E6FCF5] text-[#099268]', title:'IN: Sensor Grid × 200 units', meta:'Beta Storage Rack C4', time:'3h ago' },
          { icon: <Package className="w-3 h-3"/>, iconBg:'bg-[#FFF5F5] text-[#E03131]', title:'OUT OF STOCK: Calibration Dial', meta:'Requires immediate reorder', time:'4h ago' },
        ]} />
      </div>

      <QuickActions actions={['Add Product', 'Update Stock', 'Record Stock Movement', 'View Inventory', 'Low Stock Report', 'Warehouse Audit']} />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// ACCOUNTS DASHBOARD
// ═══════════════════════════════════════════════════════════════════════
function AccountsDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-foreground dark:text-white">Financial Overview</h1>
        <p className="text-xs text-muted-foreground">Track invoices, challans and financial records.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <KPICard label="Invoices Generated" value="128" sub="This month" icon={<Receipt className="w-4 h-4" />} />
        <KPICard label="Pending Payments" value="24" sub="₹86,400 outstanding" icon={<Clock className="w-4 h-4" />} accentLeft="border-l-[#FF6B00]" valueColor="text-[#FF6B00]" />
        <KPICard label="Completed Challans" value="104" sub="All dispatched" icon={<CheckCircle2 className="w-4 h-4" />} valueColor="text-[#099268]" />
        <KPICard label="Monthly Revenue" value="₹142K" sub="+18% vs last month" icon={<DollarSign className="w-4 h-4" />} valueColor="text-[#099268]" />
        <KPICard label="Collections" value="₹118K" sub="83% collection rate" icon={<CreditCard className="w-4 h-4" />} />
        <KPICard label="Outstanding Balance" value="₹24K" sub="Across 8 clients" icon={<AlertTriangle className="w-4 h-4" />} accentLeft="border-l-[#E03131]" valueColor="text-[#E03131]" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <AreaChart
          title="Revenue Trend"
          subtitle="Monthly collections and pending invoices this week."
          labels={['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']}
          path="M 0 100 C 60 80, 100 60, 160 35 C 220 10, 260 50, 320 30 C 380 10, 430 20, 500 8"
          fillPath="M 0 130 C 60 80, 100 60, 160 35 C 220 10, 260 50, 320 30 C 380 10, 430 20, 500 8 L 500 130 L 0 130 Z"
          points={[[0,100],[160,35],[320,30],[500,8]]}
        />
        <ActivityFeed items={[
          { icon: <Receipt className="w-3 h-3"/>, iconBg:'bg-accent/10 text-accent', title:'Invoice INV-209 generated', meta:'Chen Distributors — ₹24,800', time:'10m ago' },
          { icon: <CheckCircle2 className="w-3 h-3"/>, iconBg:'bg-[#E6FCF5] text-[#099268]', title:'Payment received: Acme Corp', meta:'INV-205 — ₹18,500 cleared', time:'45m ago' },
          { icon: <FileText className="w-3 h-3"/>, iconBg:'bg-[#E3FAFC] text-[#0C8599]', title:'Challan CH-411 invoiced', meta:'Zenith Retailers — ₹9,900', time:'1h ago' },
          { icon: <AlertTriangle className="w-3 h-3"/>, iconBg:'bg-[#FFF9DB] text-[#F59F00]', title:'Overdue: Miller Wholesale', meta:'INV-198 — ₹12,200 (14 days)', time:'2h ago' },
          { icon: <DollarSign className="w-3 h-3"/>, iconBg:'bg-[#E6FCF5] text-[#099268]', title:'Monthly revenue target hit', meta:'₹142K — 118% of target', time:'3h ago' },
          { icon: <CreditCard className="w-3 h-3"/>, iconBg:'bg-secondary dark:bg-zinc-800 text-muted-foreground', title:'Ledger sync completed', meta:'All journals reconciled', time:'5h ago' },
        ]} />
      </div>

      <QuickActions actions={['Generate Invoice', 'Export Report', 'View Challans', 'Outstanding Report', 'Monthly Ledger', 'System Settings']} />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// MAIN EXPORT — Renders correct dashboard by role
// ═══════════════════════════════════════════════════════════════════════
export default function DashboardOverview() {
  const { user } = useAuth();
  const role = user?.role || 'Admin';

  switch (role) {
    case 'Sales':     return <SalesDashboard />;
    case 'Warehouse': return <WarehouseDashboard />;
    case 'Accounts':  return <AccountsDashboard />;
    default:          return <AdminDashboard />;
  }
}
