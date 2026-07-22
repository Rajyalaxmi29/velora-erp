import React, { useState } from 'react';
import { 
  BarChart3, Download, Calendar, Filter, TrendingUp, 
  TrendingDown, FileText, ShoppingBag, PieChart, Info
} from 'lucide-react';
import { Button, Input, Select } from '../components/common/UIComponents';

interface ProductReportItem {
  rank: number;
  name: string;
  sku: string;
  category: string;
  unitsSold: number;
  revenue: number;
  growth: string;
  isPositive: boolean;
}

export default function Reports() {
  const [timeRange, setTimeRange] = useState('this-month');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [activeTab, setActiveTab] = useState<'sales' | 'inventory'>('sales');

  const productPerformance: ProductReportItem[] = [
    { rank: 1, name: 'Hydraulic Valve H1', sku: 'PROD-732-A', category: 'Hydraulics', unitsSold: 420, revenue: 117600.00, growth: '+18.4%', isPositive: true },
    { rank: 2, name: 'Servo Industrial Gear', sku: 'SKU-167-1', category: 'Machinery', unitsSold: 285, revenue: 34200.00, growth: '+12.1%', isPositive: true },
    { rank: 3, name: 'Heavy Duty Sensor Grid', sku: 'PROD-998-B', category: 'Electronics', unitsSold: 190, revenue: 28500.00, growth: '-3.2%', isPositive: false },
    { rank: 4, name: 'Aluminum Bracket Kit', sku: 'SKU-402-C', category: 'Hardware', unitsSold: 650, revenue: 16250.00, growth: '+25.0%', isPositive: true },
    { rank: 5, name: 'High Pressure Valve V2', sku: 'PROD-811-D', category: 'Hydraulics', unitsSold: 80, revenue: 12800.00, growth: '+5.7%', isPositive: true }
  ];

  const handleExportCSV = () => {
    // Generate simple mock CSV download
    const headers = ['Rank', 'Product Name', 'SKU', 'Category', 'Units Sold', 'Revenue (INR)', 'Growth'];
    const rows = productPerformance.map(p => 
      [p.rank, p.name, p.sku, p.category, p.unitsSold, p.revenue, p.growth].join(',')
    );
    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `velora_product_performance_${timeRange}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Title block */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground dark:text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-accent" />
            Executive Business Reports
          </h1>
          <p className="text-xs text-muted-foreground">Analyze business operations, sales performance, and product turnover records.</p>
        </div>
        <Button 
          variant="primary" 
          onClick={handleExportCSV}
          className="flex items-center gap-2 text-xs font-semibold py-2 px-4 shadow-sm"
        >
          <Download className="w-4 h-4" />
          Export Performance Report
        </Button>
      </div>

      {/* Control panel & Filter bar */}
      <div className="bg-white dark:bg-[#15181C] border border-border dark:border-zinc-800 rounded-xl p-4 flex flex-col md:flex-row gap-4 justify-between items-center shadow-sm">
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          <button
            onClick={() => setActiveTab('sales')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'sales'
                ? 'bg-accent/10 text-accent dark:bg-accent/20'
                : 'text-muted-foreground hover:bg-secondary dark:hover:bg-zinc-850 hover:text-foreground'
            }`}
          >
            Sales & Revenue Analytics
          </button>
          <button
            onClick={() => setActiveTab('inventory')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'inventory'
                ? 'bg-accent/10 text-accent dark:bg-accent/20'
                : 'text-muted-foreground hover:bg-secondary dark:hover:bg-zinc-850 hover:text-foreground'
            }`}
          >
            Inventory Turnover
          </button>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          <div className="w-40">
            <Select
              label=""
              options={[
                { value: 'today', label: 'Today' },
                { value: 'this-week', label: 'This Week' },
                { value: 'this-month', label: 'This Month' },
                { value: 'this-quarter', label: 'This Quarter' },
                { value: 'this-year', label: 'Full Fiscal Year' }
              ]}
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
            />
          </div>
          <div className="w-40">
            <Select
              label=""
              options={[
                { value: 'all', label: 'All Categories' },
                { value: 'Hydraulics', label: 'Hydraulics' },
                { value: 'Machinery', label: 'Machinery' },
                { value: 'Electronics', label: 'Electronics' },
                { value: 'Hardware', label: 'Hardware' }
              ]}
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-[#15181C] border border-border dark:border-zinc-800 rounded-xl p-4.5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Net Sales Revenue</span>
          <h3 className="text-2xl font-black text-foreground dark:text-white mt-1.5 font-mono">₹2,09,350.00</h3>
          <p className="text-[10px] text-[#099268] flex items-center gap-1 mt-2.5">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+14.8% vs last month</span>
          </p>
          <div className="absolute top-4 right-4 w-9 h-9 rounded-lg bg-emerald-500/10 text-[#099268] flex items-center justify-center">
            <ShoppingBag className="w-4.5 h-4.5" />
          </div>
        </div>

        <div className="bg-white dark:bg-[#15181C] border border-border dark:border-zinc-800 rounded-xl p-4.5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Average Order Value</span>
          <h3 className="text-2xl font-black text-foreground dark:text-white mt-1.5 font-mono">₹17,445.80</h3>
          <p className="text-[10px] text-[#099268] flex items-center gap-1 mt-2.5">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+3.2% growth trend</span>
          </p>
          <div className="absolute top-4 right-4 w-9 h-9 rounded-lg bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
            <FileText className="w-4.5 h-4.5" />
          </div>
        </div>

        <div className="bg-white dark:bg-[#15181C] border border-border dark:border-zinc-800 rounded-xl p-4.5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Inventory Asset Value</span>
          <h3 className="text-2xl font-black text-foreground dark:text-white mt-1.5 font-mono">₹4,25,800.00</h3>
          <p className="text-[10px] text-[#F59F00] flex items-center gap-1 mt-2.5">
            <Info className="w-3.5 h-3.5" />
            <span>840 products in catalog</span>
          </p>
          <div className="absolute top-4 right-4 w-9 h-9 rounded-lg bg-amber-500/10 text-[#F59F00] flex items-center justify-center">
            <PieChart className="w-4.5 h-4.5" />
          </div>
        </div>

        <div className="bg-white dark:bg-[#15181C] border border-border dark:border-zinc-800 rounded-xl p-4.5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Turnover Rate</span>
          <h3 className="text-2xl font-black text-foreground dark:text-white mt-1.5 font-mono">1.25x</h3>
          <p className="text-[10px] text-[#E03131] flex items-center gap-1 mt-2.5">
            <TrendingDown className="w-3.5 h-3.5" />
            <span>-2.1% deceleration</span>
          </p>
          <div className="absolute top-4 right-4 w-9 h-9 rounded-lg bg-red-500/10 text-[#E03131] flex items-center justify-center">
            <TrendingUp className="w-4.5 h-4.5 rotate-185" />
          </div>
        </div>
      </div>

      {/* Visual Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart Box */}
        <div className="bg-white dark:bg-[#15181C] border border-border dark:border-zinc-800 rounded-xl p-5 shadow-sm lg:col-span-2 space-y-4">
          <div>
            <h2 className="text-sm font-bold text-foreground dark:text-white">
              {activeTab === 'sales' ? 'Revenue Progression Details' : 'Inventory Turnover & Demand Forecast'}
            </h2>
            <p className="text-[10px] text-muted-foreground">Showing monthly aggregate trends for the selected parameters.</p>
          </div>

          <div className="h-60 relative w-full border border-border/40 dark:border-zinc-800/80 rounded-xl bg-secondary/5 dark:bg-black/5 flex items-end p-4">
            {/* SVG Interactive Chart */}
            <svg className="w-full h-full" viewBox="0 0 500 120" preserveAspectRatio="none">
              <defs>
                <linearGradient id="revenue-grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                </linearGradient>
              </defs>
              {/* Grid Lines */}
              <line x1="0" y1="30" x2="500" y2="30" stroke="currentColor" className="text-zinc-200 dark:text-zinc-850" strokeWidth="0.5" strokeDasharray="3 3" />
              <line x1="0" y1="60" x2="500" y2="60" stroke="currentColor" className="text-zinc-200 dark:text-zinc-850" strokeWidth="0.5" strokeDasharray="3 3" />
              <line x1="0" y1="90" x2="500" y2="90" stroke="currentColor" className="text-zinc-200 dark:text-zinc-850" strokeWidth="0.5" strokeDasharray="3 3" />

              {/* Area path */}
              <path d="M 0 110 Q 75 75, 150 45 T 300 30 T 450 15 L 500 10 L 500 120 L 0 120 Z" fill="url(#revenue-grad)" />

              {/* Line path */}
              <path d="M 0 110 Q 75 75, 150 45 T 300 30 T 450 15 L 500 10" fill="none" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" />

              {/* Points */}
              <circle cx="0" cy="110" r="3.5" fill="#3b82f6" stroke="#fff" strokeWidth="1.5" />
              <circle cx="150" cy="45" r="3.5" fill="#3b82f6" stroke="#fff" strokeWidth="1.5" />
              <circle cx="300" cy="30" r="3.5" fill="#3b82f6" stroke="#fff" strokeWidth="1.5" />
              <circle cx="450" cy="15" r="3.5" fill="#3b82f6" stroke="#fff" strokeWidth="1.5" />
            </svg>

            {/* X Axis Labels */}
            <div className="absolute bottom-2 left-4 right-4 flex justify-between text-[9px] text-muted-foreground font-semibold">
              <span>Q1 FY26</span>
              <span>Q2 FY26</span>
              <span>Q3 FY26</span>
              <span>Q4 FY26</span>
            </div>
          </div>
        </div>

        {/* Categories breakdown circular Donut */}
        <div className="bg-white dark:bg-[#15181C] border border-border dark:border-zinc-800 rounded-xl p-5 shadow-sm space-y-4">
          <div>
            <h2 className="text-sm font-bold text-foreground dark:text-white">Distribution Breakdown</h2>
            <p className="text-[10px] text-muted-foreground">Product categorical sales allocations.</p>
          </div>

          <div className="flex flex-col items-center justify-center py-4">
            <div className="relative w-32 h-32 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="15.91" fill="none" stroke="currentColor" className="text-zinc-100 dark:text-zinc-800" strokeWidth="3" />
                {/* Hydraulics: 55% */}
                <circle cx="18" cy="18" r="15.91" fill="none" stroke="#3b82f6" strokeWidth="3.2" strokeDasharray="55 45" strokeDashoffset="100" />
                {/* Machinery: 25% */}
                <circle cx="18" cy="18" r="15.91" fill="none" stroke="#10b981" strokeWidth="3.2" strokeDasharray="25 75" strokeDashoffset="45" />
                {/* Electronics: 15% */}
                <circle cx="18" cy="18" r="15.91" fill="none" stroke="#f59e0b" strokeWidth="3.2" strokeDasharray="15 85" strokeDashoffset="20" />
                {/* Hardware: 5% */}
                <circle cx="18" cy="18" r="15.91" fill="none" stroke="#ef4444" strokeWidth="3.2" strokeDasharray="5 95" strokeDashoffset="5" />
              </svg>
              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-xs font-black text-foreground dark:text-white">INR</span>
                <span className="text-[10px] font-bold text-muted-foreground">Revenue</span>
              </div>
            </div>

            {/* Labels */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 w-full mt-6 text-[10px] font-semibold text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" />
                <span className="truncate">Hydraulics (55%)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0" />
                <span className="truncate">Machinery (25%)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500 flex-shrink-0" />
                <span className="truncate">Electronics (15%)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0" />
                <span className="truncate">Hardware (5%)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Leaderboard performance list */}
      <div className="bg-white dark:bg-[#15181C] border border-border dark:border-zinc-800 rounded-xl shadow-sm overflow-hidden">
        <div className="p-4.5 border-b border-border dark:border-zinc-800">
          <h2 className="text-sm font-bold text-foreground dark:text-white">Product Performance Leaderboard</h2>
          <p className="text-[10px] text-muted-foreground">Detailed catalog items contribution matrix.</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-secondary/40 dark:bg-zinc-800/40 text-muted-foreground font-bold border-b border-border dark:border-zinc-800 select-none">
                <th className="py-3 px-5 text-center">Rank</th>
                <th className="py-3 px-4">Catalog Item</th>
                <th className="py-3 px-4">SKU Code</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4 text-center">Units Sold</th>
                <th className="py-3 px-4 text-right">Aggregate Sales</th>
                <th className="py-3 px-5 text-right">Trend / Growth</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60 dark:divide-zinc-800/80">
              {productPerformance
                .filter(p => categoryFilter === 'all' || p.category === categoryFilter)
                .map((p) => (
                  <tr key={p.rank} className="hover:bg-secondary/20 dark:hover:bg-zinc-800/20 transition-colors">
                    <td className="py-3 px-5 text-center font-bold font-mono text-muted-foreground">{p.rank}</td>
                    <td className="py-3 px-4 font-semibold text-foreground dark:text-white">{p.name}</td>
                    <td className="py-3 px-4 font-mono text-[10px] text-muted-foreground">{p.sku}</td>
                    <td className="py-3 px-4 text-muted-foreground">{p.category}</td>
                    <td className="py-3 px-4 text-center font-mono font-bold">{p.unitsSold}</td>
                    <td className="py-3 px-4 text-right font-mono font-black text-foreground dark:text-white">
                      ₹{p.revenue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                    <td className={`py-3 px-5 text-right font-bold font-mono ${p.isPositive ? 'text-[#099268]' : 'text-[#E03131]'}`}>
                      {p.growth}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
