import React, { useState, useEffect } from 'react';
import { inventoryService } from '../services/inventoryService';
import { productService } from '../services/productService';
import { Product, StockMovement } from '../types';
import { useToast } from '../components/common/Toast';
import { StatusBadge, Skeleton, EmptyState } from '../components/common/UIComponents';
import { AlertTriangle, Boxes, CheckCircle2, XCircle, Search, ArrowDownRight, ArrowUpRight, Clock } from 'lucide-react';

export default function InventoryManagement() {
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalProducts: 0, availableStock: 0, lowStock: 0, outOfStock: 0 });
  const [search, setSearch] = useState('');
  const [warehouseFilter, setWarehouseFilter] = useState('All');

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [prods, moves, s] = await Promise.all([
        productService.getProducts(),
        inventoryService.getMovements(),
        inventoryService.getInventoryStats(),
      ]);
      setProducts(prods);
      setMovements(moves);
      setStats(s);
    } catch {
      toast('Failed to load inventory.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const warehouses = ['All', ...Array.from(new Set(products.map((p) => p.warehouse.split(' (')[0])))];

  const filteredProducts = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase());
    const matchWarehouse = warehouseFilter === 'All' || p.warehouse.startsWith(warehouseFilter);
    return matchSearch && matchWarehouse;
  });

  const getStockStatus = (p: Product) => {
    if (p.currentStock === 0) return 'Out of Stock';
    if (p.currentStock < p.minStock) return 'Low Stock';
    return 'Active';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold tracking-tight text-foreground dark:text-white">Inventory Management</h1>
        <p className="text-xs text-muted-foreground">Real-time stock levels, warehouse locations, and movement audit trail.</p>
      </div>

      {/* KPI Cards */}
      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1,2,3,4].map(i => <Skeleton key={i} className="h-24" />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-[#15181C] border border-border dark:border-zinc-800 rounded-xl p-4 shadow-sm">
            <div className="flex justify-between items-center text-muted-foreground">
              <span className="text-[9px] uppercase tracking-wider font-bold">Total Products</span>
              <Boxes className="w-4 h-4" />
            </div>
            <div className="text-2xl font-black tracking-tight mt-2 text-foreground">{stats.totalProducts}</div>
            <div className="text-[8px] text-muted-foreground mt-1">Across all warehouses</div>
          </div>

          <div className="bg-white dark:bg-[#15181C] border border-border dark:border-zinc-800 rounded-xl p-4 shadow-sm">
            <div className="flex justify-between items-center text-muted-foreground">
              <span className="text-[9px] uppercase tracking-wider font-bold">Available Stock</span>
              <CheckCircle2 className="w-4 h-4 text-[#099268]" />
            </div>
            <div className="text-2xl font-black tracking-tight mt-2 text-foreground">{stats.availableStock.toLocaleString()}</div>
            <div className="text-[8px] text-[#099268] font-semibold mt-1">Total units in system</div>
          </div>

          <div className="bg-white dark:bg-[#15181C] border border-border dark:border-zinc-800 border-l-2 border-l-[#FF6B00] rounded-xl p-4 shadow-sm">
            <div className="flex justify-between items-center">
              <span className="text-[9px] uppercase tracking-wider font-bold text-[#FF6B00]">Low Stock</span>
              <AlertTriangle className="w-4 h-4 text-[#FF6B00]" />
            </div>
            <div className="text-2xl font-black tracking-tight mt-2 text-[#FF6B00]">{stats.lowStock}</div>
            <div className="text-[8px] text-[#FF6B00] font-semibold mt-1">Below reorder limit</div>
          </div>

          <div className="bg-white dark:bg-[#15181C] border border-border dark:border-zinc-800 border-l-2 border-l-[#E03131] rounded-xl p-4 shadow-sm">
            <div className="flex justify-between items-center">
              <span className="text-[9px] uppercase tracking-wider font-bold text-[#E03131]">Out of Stock</span>
              <XCircle className="w-4 h-4 text-[#E03131]" />
            </div>
            <div className="text-2xl font-black tracking-tight mt-2 text-[#E03131]">{stats.outOfStock}</div>
            <div className="text-[8px] text-[#E03131] font-semibold mt-1">Needs immediate restock</div>
          </div>
        </div>
      )}

      {/* Inventory Table + Movement History */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* Inventory Table */}
        <div className="xl:col-span-2 bg-white dark:bg-[#15181C] border border-border dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm">
          <div className="p-4 border-b border-border dark:border-zinc-800 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60" />
              <input
                placeholder="Search inventory..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs border border-border dark:border-zinc-800 rounded-lg bg-[#FCFCFD] dark:bg-[#1E2228] focus:outline-none focus:ring-1 focus:ring-accent"
              />
            </div>
            <select
              value={warehouseFilter}
              onChange={(e) => setWarehouseFilter(e.target.value)}
              className="text-xs border border-border dark:border-zinc-800 rounded-lg bg-white dark:bg-[#1E2228] px-3 py-2 focus:outline-none focus:ring-1 focus:ring-accent"
            >
              {warehouses.map((w) => <option key={w} value={w}>{w}</option>)}
            </select>
          </div>

          {loading ? (
            <div className="p-6 space-y-3">
              {[1,2,3,4].map(i => <Skeleton key={i} className="h-12 w-full" />)}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="p-10"><EmptyState message="No inventory items found." /></div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead className="bg-[#FCFCFD] dark:bg-zinc-800/40 border-b border-border dark:border-zinc-800 text-[9px] font-bold text-muted-foreground uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-5 text-left">Product</th>
                    <th className="py-3 px-4 text-left">Warehouse</th>
                    <th className="py-3 px-4 text-center">Current</th>
                    <th className="py-3 px-4 text-center">Min Alert</th>
                    <th className="py-3 px-4 text-right">Stock Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60 dark:divide-zinc-800/80">
                  {filteredProducts.map((p) => {
                    const status = getStockStatus(p);
                    const isLow = status === 'Low Stock';
                    const isOut = status === 'Out of Stock';
                    return (
                      <tr key={p.id} className={`hover:bg-secondary/20 dark:hover:bg-zinc-800/20 transition-colors ${isOut ? 'bg-[#FFF5F5]/50 dark:bg-[#1A0F0F]/30' : isLow ? 'bg-[#FFF9F0]/50 dark:bg-[#1A1200]/20' : ''}`}>
                        <td className="py-3 px-5">
                          <div>
                            <p className="font-semibold text-foreground dark:text-white truncate max-w-[180px]">{p.name}</p>
                            <p className="text-[9px] text-muted-foreground font-mono">{p.sku}</p>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-[10px] text-muted-foreground truncate max-w-[120px]">{p.warehouse.split(' (')[0]}</td>
                        <td className={`py-3 px-4 text-center font-black font-mono text-sm ${isOut ? 'text-[#E03131]' : isLow ? 'text-[#FF6B00]' : 'text-[#099268]'}`}>
                          {p.currentStock}
                        </td>
                        <td className="py-3 px-4 text-center font-mono text-muted-foreground">{p.minStock}</td>
                        <td className="py-3 px-4 text-right">
                          <StatusBadge status={status} />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Stock Movement History */}
        <div className="bg-white dark:bg-[#15181C] border border-border dark:border-zinc-800 rounded-xl shadow-sm flex flex-col">
          <div className="p-4 border-b border-border dark:border-zinc-800">
            <h3 className="text-sm font-bold text-foreground">Movement Audit Log</h3>
            <p className="text-[10px] text-muted-foreground">Recent IN/OUT stock transactions.</p>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {loading ? (
              <div className="space-y-3">
                {[1,2,3].map(i => <Skeleton key={i} className="h-16 w-full" />)}
              </div>
            ) : movements.length === 0 ? (
              <EmptyState message="No stock movements recorded yet." />
            ) : (
              movements.map((m) => (
                <div key={m.id} className="p-3 bg-secondary/25 dark:bg-[#1E2228]/50 border border-border/60 dark:border-zinc-800/60 rounded-lg space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      {m.type === 'IN' ? (
                        <span className="flex items-center gap-1 bg-[#E6FCF5] text-[#099268] dark:bg-[#103024] dark:text-[#63E6BE] px-2 py-0.5 rounded font-bold text-[9px]">
                          <ArrowUpRight className="w-3 h-3" /> IN
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 bg-[#FFF5F5] text-[#E03131] dark:bg-[#341818] dark:text-[#FFA8A8] px-2 py-0.5 rounded font-bold text-[9px]">
                          <ArrowDownRight className="w-3 h-3" /> OUT
                        </span>
                      )}
                      <span className="font-bold text-foreground text-[10px] font-mono">{m.quantity} units</span>
                    </div>
                    <span className="text-[8px] font-mono text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(m.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-[10px] font-semibold text-foreground truncate">{m.productName}</p>
                  <p className="text-[9px] text-muted-foreground leading-snug">{m.reason}</p>
                  <p className="text-[8px] text-muted-foreground/70">By: {m.createdBy}</p>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
